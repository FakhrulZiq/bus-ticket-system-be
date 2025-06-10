import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Bus,
  BusSchema,
} from 'src/infrastructure/dataAccess/schemas/Bus.schema';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { RedisClientProvider } from 'src/infrastructure/redis/redis.provider';
import { RedisCacheService } from 'src/infrastructure/redis/redisService';
import { TYPES } from 'src/utilities/constant';
import { BusController } from './bus.controller';
import { BusService } from './Bus.service';
import { BusRepository } from 'src/infrastructure/dataAccess/repositories/bus.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bus.name, schema: BusSchema }])],
  controllers: [BusController],
  providers: [
    {
      provide: TYPES.IBusService,
      useClass: BusService,
    },
    {
      provide: TYPES.IBusRepository,
      useClass: BusRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    { provide: TYPES.IRedisService, useClass: RedisCacheService },
    RedisClientProvider,
  ],
})
export class BusModule {}
