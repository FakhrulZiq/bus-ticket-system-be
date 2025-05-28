import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Audit } from 'src/infrastructure/audit/audit';
import { IUserRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/user.repository.interface';
import { UserDocument } from 'src/infrastructure/dataAccess/schemas/user.schema';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  IAuthService,
  ILogoutInput,
  ILogOutResponse,
  INewAccessToken,
  INewAccessTokenInput,
  IPayloadJwt,
  IResetPasswordInput,
  IResetPasswordResponse,
  IValidateUserInput,
  IValidateUserResponse,
} from 'src/infrastructure/serviceInterfaces/auth.service.interface';
import { IUserService } from 'src/infrastructure/serviceInterfaces/user.service.interface';
import { CRUD_ACTION, TYPES } from 'src/utilities/constant';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @Inject(TYPES.IUserService)
    private readonly _userService: IUserService,
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

  async logout(input: ILogoutInput): Promise<ILogOutResponse> {
    try {
      const payload = this._jwtService.verify(input.refreshToken, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user: UserDocument = await this._userRepository.findOne({
        email: payload.email,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.refreshToken) {
        throw new BadRequestException(
          'User already logged out, Please login again!',
        );
      }
      const isValid = await bcrypt.compare(
        input.refreshToken,
        user.refreshToken,
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      user.refreshToken = null;
      await this._userRepository.save(user);

      return { message: 'User log out successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async resetPassword(
    input: IResetPasswordInput,
  ): Promise<IResetPasswordResponse> {
    try {
      const { email, password } = input;

      const user = await this._userRepository.findOne({ email });
      if (!user) {
        throw new NotFoundException(`There is no user with email ${email}`);
      }

      const hashedPassword: string = await bcrypt.hash(password, 10);

      const audit: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );

      const update = {
        password: hashedPassword,
        ...audit,
      };

      const savedPassword = await this._userRepository.update(
        { email },
        update,
      );

      if (!savedPassword) {
        throw new Error('Update user password failed.');
      }

      return { message: 'Password reset successfully!' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async assignNewAcessToken(
    input: INewAccessTokenInput,
  ): Promise<INewAccessToken> {
    try {
      const today: number = Date.now();
      const payload: IPayloadJwt = this._jwtService.verify(input.refreshToken, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this._userRepository.findOne({ email: payload.email });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (today > payload.exp * 1000) {
        await this._userService.clearRefreshToken(user.email);

        throw new BadRequestException(
          'Your session has expired. Please log in again.',
        );
      }

      const inputNewToken = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      const newAccessToken = this._jwtService.sign(inputNewToken, {
        expiresIn: '2m',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }
}
