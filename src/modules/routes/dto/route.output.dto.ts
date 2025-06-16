import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteResponse {
  @ApiProperty()
  message: string;
}
