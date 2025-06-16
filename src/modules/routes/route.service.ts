import { Inject, Injectable } from '@nestjs/common';
import { IRouteRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/route.repository.interface';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IRouteService } from 'src/infrastructure/serviceInterfaces/route.service.interface';
import { TYPES } from 'src/utilities/constant';

@Injectable()
export class RouteService implements IRouteService {
  constructor(
    @Inject(TYPES.IRouteRepository)
    private readonly _routeRepository: IRouteRepository,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
  ) {}
}
