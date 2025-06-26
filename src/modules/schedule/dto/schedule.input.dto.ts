import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleInput {
  @ApiProperty()
  busId: string;

  @ApiProperty()
  routeId: string;

  @ApiProperty()
  departureDateTime: string;

  @ApiProperty()
  arrivalDateTime: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  seatLayout: string;

  @ApiProperty()
  bookedSeats: string[];
}

export class ListScheduleInput {
  @ApiProperty()
  search?: string;

  @ApiProperty()
  pageNum?: number;

  @ApiProperty()
  pageSize?: number;
}
