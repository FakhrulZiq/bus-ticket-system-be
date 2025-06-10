import { ApiProperty } from '@nestjs/swagger';

export class CreateBusInput {
  @ApiProperty()
  plateNumber: string;

  @ApiProperty()
  busType: string;

  @ApiProperty()
  totalSeats: number;

  @ApiProperty()
  operatorName: string;
}
