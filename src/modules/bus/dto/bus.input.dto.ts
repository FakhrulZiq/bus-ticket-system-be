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

export class ListBusInput {
  @ApiProperty()
  search?: string;

  @ApiProperty()
  pageNum?: number;

  @ApiProperty()
  pageSize?: number;
}
