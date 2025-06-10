import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Audit } from 'src/infrastructure/audit/audit';
import { ILocationRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/location.repository.interfac';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  ICreateLocationInput,
  ICreateLocationResponse,
  ILocationService,
} from 'src/infrastructure/serviceInterfaces/location.service.interfac';

import { CRUD_ACTION, TYPES } from 'src/utilities/constant';

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

  private async _deleteLocationPageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_Location_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
