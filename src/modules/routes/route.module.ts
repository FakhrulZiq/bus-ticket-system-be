import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RouteRepository } from 'src/infrastructure/dataAccess/repositories/Route.repository';
import {
  Route,
  RouteSchema,
} from 'src/infrastructure/dataAccess/schemas/Route.schema';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { RedisClientProvider } from 'src/infrastructure/redis/redis.provider';
import { RedisCacheService } from 'src/infrastructure/redis/redisService';
import { TYPES } from 'src/utilities/constant';
import { RouteController } from './route.controller';
import { RouteService } from './Route.service';
import { LocationRepository } from 'src/infrastructure/dataAccess/repositories/Location.repository';
import {
  Location,
  LocationSchema,
} from 'src/infrastructure/dataAccess/schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Route.name, schema: RouteSchema },
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [RouteController],
  providers: [
    {
      provide: TYPES.IRouteService,
      useClass: RouteService,
    },
    {
      provide: TYPES.IRouteRepository,
      useClass: RouteRepository,
    },
    {
      provide: TYPES.ILocationRepository,
      useClass: LocationRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    { provide: TYPES.IRedisService, useClass: RedisCacheService },
    RedisClientProvider,
  ],
})
export class RouteModule {}
