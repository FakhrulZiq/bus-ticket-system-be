import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Audit } from 'src/infrastructure/audit/audit';
import { ILocationRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/location.repository.interfac';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  ICreateLocationInput,
  ICreateLocationResponse,
  IDeleteLocationResponse,
  IFindLocationResponse,
  IListLocationInput,
  ILocationByID,
  ILocationService,
  IUpdateLocationInput,
} from 'src/infrastructure/serviceInterfaces/location.service.interfac';

import {
  CRUD_ACTION,
  DEFAULT_CACHE_TIME_TO_LIVE,
  PAGINATION,
  TYPES,
} from 'src/utilities/constant';
import { LocationParser } from './location.parser';
import { pagination } from 'src/utilities/utility';

@Injectable()
export class LocationService implements ILocationService {
  constructor(
    @Inject(TYPES.ILocationRepository)
    private readonly _locationRepository: ILocationRepository,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
  ) {}

  async createLocation(
    input: ICreateLocationInput,
    email: string,
  ): Promise<ICreateLocationResponse> {
    try {
      const { terminal } = input;
      const existingLocation = await this._locationRepository.findOne({
        terminal,
      });
      if (existingLocation) {
        throw new ConflictException('This terminal already registered');
      }

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.create,
      );

      const locationToSave = { ...input, ...auditProps };

      const savedLocation = await this._locationRepository.save(locationToSave);
      if (!savedLocation) {
        throw new BadRequestException(`Unable to create a new Location`);
      }

      await this._deleteLocationPageCache();

      return { message: 'Location registered successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async listLocation(
    input: IListLocationInput,
  ): Promise<IFindLocationResponse> {
    try {
      const { pageNum, pageSize, search } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `list_Location_page${pageNum}_limit${pageSize}_searchBy${search}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData && !input.search) {
        return cachedData;
      }
      const Locations =
        await this._locationRepository.listLocationByPagination(input);

      const parsedLocation = LocationParser.listLocation(Locations.data);

      const paginatedBook: IFindLocationResponse = pagination(
        parsedLocation,
        input,
        Locations.total,
      ) as unknown as IFindLocationResponse;

      await this._cacheResponse(paginatedBook, cacheKey);

      return paginatedBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findLocationById(id: string): Promise<ILocationByID> {
    try {
      const location = await this._locationRepository.findOne({ id });
      if (!location) {
        throw new NotFoundException(`location with ID ${id} not found`);
      }

      const locationById = LocationParser.locationById(location);

      return locationById;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async deleteLocation(
    id: string,
    email: string,
  ): Promise<IDeleteLocationResponse> {
    try {
      const user = await this._locationRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException('Location not found');
      }

      const deleteAuditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.delete,
      );

      const deleteUser = await this._locationRepository.update(
        { id },
        { ...deleteAuditProps },
      );
      if (!deleteUser) {
        throw new InternalServerErrorException(`Failed to delete Location`);
      }

      await this._deleteLocationPageCache();

      return { message: 'Location deleted successfully!' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async updateLocation(
    id: string,
    input: IUpdateLocationInput,
    email: string,
  ): Promise<ILocationByID> {
    try {
      const route = await this._locationRepository.findOne({ id });
      if (!route) {
        throw new NotFoundException(`There is no Location with ID ${id}`);
      }

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );

      const LocationUpdate = await this._locationRepository.update(
        { id },
        { ...auditProps, ...input },
      );
      if (!LocationUpdate) {
        throw new InternalServerErrorException(`Failed to update Location`);
      }

      await this._deleteLocationPageCache();

      return LocationParser.locationById(LocationUpdate);
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

  private async _deleteLocationPageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_Location_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
