import { ApiProperty } from '@nestjs/swagger';

export class LoginInput {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LogoutInput {
  @ApiProperty()
  refreshToken: string;
}

export class RefreshTokenInput extends LogoutInput {}

export class ResetPasswordInput extends LoginInput {}
