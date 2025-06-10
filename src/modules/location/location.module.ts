import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationRepository } from 'src/infrastructure/dataAccess/repositories/Location.repository';
import {
  Location,
  LocationSchema,
} from 'src/infrastructure/dataAccess/schemas/Location.schema';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { RedisClientProvider } from 'src/infrastructure/redis/redis.provider';
import { RedisCacheService } from 'src/infrastructure/redis/redisService';
import { TYPES } from 'src/utilities/constant';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [LocationController],
  providers: [
    {
      provide: TYPES.ILocationService,
      useClass: LocationService,
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
export class LocationModule {}
