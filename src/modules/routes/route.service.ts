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
import {
  IListRouteByPaginationResponse,
  IRouteRepository,
} from 'src/infrastructure/dataAccess/repositories/interfaces/route.repository.interface';
import { LocationDocument } from 'src/infrastructure/dataAccess/schemas/location.schema';
import { RouteDocument } from 'src/infrastructure/dataAccess/schemas/route.schema';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  ICreateRouteInput,
  ICreateRouteResponse,
  IDeleteRouteResponse,
  IFindRouteResponse,
  IListRouteInput,
  IRouteByID,
  IRouteService,
  IUpdateRouteInput,
} from 'src/infrastructure/serviceInterfaces/route.service.interface';
import {
  CRUD_ACTION,
  DEFAULT_CACHE_TIME_TO_LIVE,
  PAGINATION,
  TYPES,
} from 'src/utilities/constant';
import { pagination } from 'src/utilities/utility';
import { RouteParser } from './route.parser';

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

  async listRoute(input: IListRouteInput): Promise<IFindRouteResponse> {
    try {
      const { pageNum, pageSize, search } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `list_route_page${pageNum}_limit${pageSize}_searchBy${search}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData && !input.search) {
        return cachedData;
      }
      const routes: IListRouteByPaginationResponse =
        await this._routeRepository.listRouteByPagination(input);

      const parsedRoute = RouteParser.listRoute(routes.data);

      const paginatedBook: IFindRouteResponse = pagination(
        parsedRoute,
        input,
        routes.total,
      ) as unknown as IFindRouteResponse;

      await this._cacheResponse(paginatedBook, cacheKey);

      return paginatedBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async deleteRoute(id: string, email: string): Promise<IDeleteRouteResponse> {
    try {
      const user = await this._routeRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException('Route not found');
      }

      const deleteAuditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.delete,
      );

      const deleteUser = await this._routeRepository.update(
        { id },
        { ...deleteAuditProps },
      );
      if (!deleteUser) {
        throw new InternalServerErrorException(`Failed to delete Route`);
      }

      await this._deleteRoutePageCache();

      return { message: 'Route deleted successfully!' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findRouteById(id: string): Promise<IRouteByID> {
    try {
      const route = await this._routeRepository.getRouteByID(id);
      if (!route) {
        throw new NotFoundException(`Route with ID ${id} not found`);
      }

      const RouteById = RouteParser.routeById(route);

      return RouteById;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async updateRoute(
    id: string,
    input: IUpdateRouteInput,
    email: string,
  ): Promise<IRouteByID> {
    try {
      const route = await this._routeRepository.findOne({ id });
      if (!route) {
        throw new NotFoundException(`There is no Route with ID ${id}`);
      }

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );

      const routeUpdate = await this._routeRepository.update(
        { id },
        { ...auditProps, ...input },
      );
      if (!routeUpdate) {
        throw new InternalServerErrorException(`Failed to update Route`);
      }

      await this._deleteRoutePageCache();

      const routeResponse = await this._routeRepository.getRouteByID(
        routeUpdate.id,
      );

      return RouteParser.routeById(routeResponse);
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

  private async _deleteRoutePageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_route_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
