import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/dataAccess/database/database.module';
import { RedisCacheModule } from './infrastructure/redis/redisModule';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, RedisCacheModule, UserModule],
})
export class AppModule {}
