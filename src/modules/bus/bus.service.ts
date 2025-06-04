import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Audit } from 'src/infrastructure/audit/audit';
import { IBusRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/bus.repository.interface';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  IBusService,
  ICreateBusInput,
  ICreateBusResponse,
} from 'src/infrastructure/serviceInterfaces/bus.service.interface';

import { CRUD_ACTION, TYPES } from 'src/utilities/constant';

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

  private async _deleteBusPageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_Bus_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
