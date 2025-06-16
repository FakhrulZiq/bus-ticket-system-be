import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Audit } from 'src/infrastructure/audit/audit';
import { ILocationRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/location.repository.interfac';
import { IRouteRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/route.repository.interface';
import { LocationDocument } from 'src/infrastructure/dataAccess/schemas/location.schema';
import { RouteDocument } from 'src/infrastructure/dataAccess/schemas/route.schema';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  ICreateRouteInput,
  ICreateRouteResponse,
  IRouteService,
} from 'src/infrastructure/serviceInterfaces/route.service.interface';
import { CRUD_ACTION, TYPES } from 'src/utilities/constant';

@Injectable()
export class RouteService implements IRouteService {
  constructor(
    @Inject(TYPES.IRouteRepository)
    private readonly _routeRepository: IRouteRepository,
    @Inject(TYPES.ILocationRepository)
    private readonly _locationRepository: ILocationRepository,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
  ) {}

  async createRoute(
    input: ICreateRouteInput,
    email: string,
  ): Promise<ICreateRouteResponse> {
    try {
      const existingRoute: boolean =
        await this._routeRepository.isDuplicateRoute(input);
      if (existingRoute) {
        throw new ConflictException('This terminal already registered');
      }

      const destination: LocationDocument =
        await this._locationRepository.findOne({
          id: input.destination,
        });
      if (!destination) {
        throw new NotFoundException('This destination terminal not found');
      }
      input.destination = destination.id;

      const departure: LocationDocument =
        await this._locationRepository.findOne({
          id: input.departure,
        });
      if (!departure) {
        throw new NotFoundException('This departure terminal not found');
      }
      input.departure = departure.id;

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.create,
      );

      const routeToSave = { ...input, ...auditProps };

      const savedRoute: RouteDocument =
        await this._routeRepository.save(routeToSave);
      if (!savedRoute) {
        throw new BadRequestException(`Unable to create a new route`);
      }

      await this._deleteRoutePageCache();

      return { message: 'Route registered successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private async _deleteRoutePageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_Location_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
