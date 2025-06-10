import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationResponse {
  @ApiProperty()
  message: string;
}
