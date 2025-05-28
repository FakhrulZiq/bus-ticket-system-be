import { Body, Controller, Inject, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IAuthService } from 'src/infrastructure/serviceInterfaces/auth.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from './auth.guard';
import {
  LoginInput,
  LogoutInput,
  ResetPasswordInput,
} from './dto/authInput.dto';
import {
  AuthResponse,
  LogOutResponse,
  ResetPasswordResponse,
} from './dto/authOutput.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TYPES.IAuthService)
    private readonly _authService: IAuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User Log in to system' })
  async login(@Body() loginInput: LoginInput): Promise<AuthResponse> {
    return await this._authService.validateUser(loginInput);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout from system' })
  @UseGuards(JwtAuthGuard)
  async logout(@Body() input: LogoutInput): Promise<LogOutResponse> {
    return await this._authService.logout(input);
  }

  @Put('reset-password')
  @ApiOperation({ summary: 'Update password' })
  async updatePassowrd(
    @Body() input: ResetPasswordInput,
  ): Promise<ResetPasswordResponse> {
    return await this._authService.resetPassword(input);
  }
}
