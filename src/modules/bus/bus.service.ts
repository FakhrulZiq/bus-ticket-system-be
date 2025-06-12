import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Audit } from 'src/infrastructure/audit/audit';
import { IBusRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/bus.repository.interface';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  IBusByID,
  IBusService,
  ICreateBusInput,
  ICreateBusResponse,
  IDeleteBusResponse,
  IFindBusResponse,
  IListBusInput,
} from 'src/infrastructure/serviceInterfaces/bus.service.interface';

import {
  CRUD_ACTION,
  DEFAULT_CACHE_TIME_TO_LIVE,
  PAGINATION,
  TYPES,
} from 'src/utilities/constant';
import { pagination } from 'src/utilities/utility';
import { BusParser } from './bus.parser';

@Injectable()
export class BusService implements IBusService {
  constructor(
    @Inject(TYPES.IBusRepository)
    private readonly _busRepository: IBusRepository,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
  ) {}

  async createBus(
    input: ICreateBusInput,
    email: string,
  ): Promise<ICreateBusResponse> {
    try {
      const { plateNumber } = input;
      const existingBus = await this._busRepository.findOne({ plateNumber });
      if (existingBus) {
        throw new ConflictException('This Bus already registered');
      }

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.create,
      );

      const busToSave = { ...input, ...auditProps };

      const savedBus = await this._busRepository.save(busToSave);

      if (!savedBus) {
        throw new BadRequestException(`Unable to create a new Bus`);
      }

      await this._deleteBusPageCache();

      return { message: 'Bus registered successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async listBus(input: IListBusInput): Promise<IFindBusResponse> {
    try {
      const { pageNum, pageSize, search } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `list_Bus_page${pageNum}_limit${pageSize}_searchBy${search}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData && !input.search) {
        return cachedData;
      }
      const Buss = await this._busRepository.listBusByPagination(input);

      const parsedBus = BusParser.listBus(Buss.data);

      const paginatedBook: IFindBusResponse = pagination(
        parsedBus,
        input,
        Buss.total,
      ) as unknown as IFindBusResponse;

      await this._cacheResponse(paginatedBook, cacheKey);

      return paginatedBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findBusById(id: string): Promise<IBusByID> {
    try {
      const bus = await this._busRepository.findOne({ id });
      if (!bus) {
        throw new NotFoundException(`Bus with ID ${id} not found`);
      }

      const busById = BusParser.busById(bus);

      return busById;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async deleteBus(id: string, email: string): Promise<IDeleteBusResponse> {
    try {
      const user = await this._busRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException('Bus not found');
      }

      const deleteAuditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.delete,
      );

      const deleteUser = await this._busRepository.update(
        { id },
        { ...deleteAuditProps },
      );
      if (!deleteUser) {
        throw new InternalServerErrorException(`Failed to delete bus`);
      }

      await this._deleteBusPageCache();

      return { message: 'Bus deleted successfully!' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private async _getCachedData(cacheKey: string): Promise<any> {
    return (await this._redisCacheService.get(cacheKey)) as any;
  }

  private async _cacheResponse(data: any, cacheKey: string): Promise<void> {
    await this._redisCacheService.set(
      cacheKey,
      data,
      DEFAULT_CACHE_TIME_TO_LIVE,
    );
  }

  private async _deleteBusPageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_Bus_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
