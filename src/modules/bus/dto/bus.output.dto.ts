import { ApiProperty } from '@nestjs/swagger';

export class CreateBusResponse {
  @ApiProperty()
  message: string;
}

export class FindBusResponse {
  @ApiProperty()
  data: BusByIdResponse[];

  @ApiProperty()
  startRecord: number;

  @ApiProperty()
  endRecord: number;

  @ApiProperty()
  total?: number;

  @ApiProperty()
  pageSize?: number;

  @ApiProperty()
  totalPages?: number;

  @ApiProperty()
  nextPage?: number;
}

export class BusByIdResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  plateNumber: string;

  @ApiProperty()
  busType: string;

  @ApiProperty()
  totalSeats: number;

  @ApiProperty()
  operatorName: string;
}
