import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuthService } from 'src/infrastructure/serviceInterfaces/auth.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from './auth.guard';
import { LoginInput, LogoutInput } from './dto/authInput.dto';
import { AuthResponse, LogOutResponse } from './dto/authOutput.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TYPES.IAuthService)
    private readonly _authService: IAuthService,
  ) {}

  @Post('login')
  async login(@Body() loginInput: LoginInput): Promise<AuthResponse> {
    return await this._authService.validateUser(loginInput);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() input: LogoutInput): Promise<LogOutResponse> {
    return await this._authService.logout(input);
  }
}
