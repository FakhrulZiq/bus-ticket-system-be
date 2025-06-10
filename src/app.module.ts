import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/dataAccess/database/database.module';
import { RedisCacheModule } from './infrastructure/redis/redisModule';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { BusModule } from './modules/bus/bus.module';

@Module({
  imports: [
    DatabaseModule,
    RedisCacheModule,
    UserModule,
    AuthModule,
    ScheduleModule,
    BusModule,
  ],
})
export class AppModule {}
