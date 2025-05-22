import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/user.repository.interface';
import { UserDocument } from 'src/infrastructure/dataAccess/schemas/user.schema';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import {
  IAuthService,
  IValidateUserInput,
  IValidateUserResponse,
} from 'src/infrastructure/serviceInterfaces/auth.service.interface';
import { TYPES } from 'src/utilities/constant';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
  ) {}

  async validateUser(
    input: IValidateUserInput,
  ): Promise<IValidateUserResponse> {
    try {
      const { email, password } = input;
      const user: UserDocument = await this._userRepository.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id, role: user.role };

      const accessToken = this._jwtService.sign(payload, {
        expiresIn: '2h',
      });

      const refreshToken = this._jwtService.sign(payload, {
        expiresIn: '1d',
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      user.refreshToken = hashedRefreshToken;
      await this._userRepository.save(user);

      return {
        accessToken,
        refreshToken,
        email: user.email,
        role: user.role,
        name: user.name,
        id: user.id,
      };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }
}
