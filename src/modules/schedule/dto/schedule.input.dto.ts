import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleInput {
  @ApiProperty()
  busNumber: string;

  @ApiProperty()
  route: string;

  @ApiProperty()
  departureTime: string;

  @ApiProperty()
  arrivalTime: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  seatLayout: string;

  @ApiProperty()
  bookedSeats: string[];
}
