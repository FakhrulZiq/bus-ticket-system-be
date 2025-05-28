import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from 'src/infrastructure/dataAccess/repositories/user.repository';
import {
  User,
  UserSchema,
} from 'src/infrastructure/dataAccess/schemas/user.schema';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { RedisClientProvider } from 'src/infrastructure/redis/redis.provider';
import { RedisCacheService } from 'src/infrastructure/redis/redisService';
import { TYPES } from 'src/utilities/constant';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stratergy';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: TYPES.IAuthService,
      useClass: AuthService,
    },
    {
      provide: TYPES.IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: TYPES.IUserService,
      useClass: UserService,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    { provide: TYPES.IRedisService, useClass: RedisCacheService },
    RedisClientProvider,
    JwtStrategy,
  ],
})
export class AuthModule {}
