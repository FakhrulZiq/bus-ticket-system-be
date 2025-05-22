import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuthService } from 'src/infrastructure/serviceInterfaces/auth.service.interface';
import { TYPES } from 'src/utilities/constant';
import { LoginInput } from './dto/authInput.dto';
import { AuthResponse } from './dto/authOutput.dto';

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
}
