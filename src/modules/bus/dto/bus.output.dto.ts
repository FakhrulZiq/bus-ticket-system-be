import { ApiProperty } from '@nestjs/swagger';

export class CreateBusResponse {
  @ApiProperty()
  message: string;
}
