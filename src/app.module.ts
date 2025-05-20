import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/dataAccess/database/database.module';
import { RedisCacheModule } from './infrastructure/redis/redisModule';

@Module({
  imports: [DatabaseModule, RedisCacheModule],
})
export class AppModule {}
