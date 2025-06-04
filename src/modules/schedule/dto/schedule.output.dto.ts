import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleResponse {
  @ApiProperty()
  message: string;
}
