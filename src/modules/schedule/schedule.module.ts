import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleRepository } from 'src/infrastructure/dataAccess/repositories/schedule.repository';
import {
  Schedule,
  ScheduleSchema,
} from 'src/infrastructure/dataAccess/schemas/schedule.schema';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { RedisClientProvider } from 'src/infrastructure/redis/redis.provider';
import { RedisCacheService } from 'src/infrastructure/redis/redisService';
import { TYPES } from 'src/utilities/constant';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [
    {
      provide: TYPES.IScheduleService,
      useClass: ScheduleService,
    },
    {
      provide: TYPES.IScheduleRepository,
      useClass: ScheduleRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    { provide: TYPES.IRedisService, useClass: RedisCacheService },
    RedisClientProvider,
  ],
})
export class ScheduleModule {}
