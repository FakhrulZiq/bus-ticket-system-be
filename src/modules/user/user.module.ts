import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TYPES } from 'src/utilities/constant';
import { UserRepository } from 'src/infrastructure/dataAccess/repositories/user.repository';
import {
  User,
  UserSchema,
} from 'src/infrastructure/dataAccess/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { RedisCacheService } from 'src/infrastructure/redis/redisService';
import { RedisClientProvider } from 'src/infrastructure/redis/redis.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: TYPES.IUserService,
      useClass: UserService,
    },
    {
      provide: TYPES.IUserRepository,
      useClass: UserRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    { provide: TYPES.IRedisService, useClass: RedisCacheService },
    RedisClientProvider,
  ],
})
export class UserModule {}
