import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleResponse {
  @ApiProperty()
  message: string;
}

export class FindScheduleResponse {
  @ApiProperty()
  data: ScheduleByIdResponse[];

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

export class ScheduleByIdResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bus: IBusDetails;

  @ApiProperty()
  route: IRouteDetails;

  @ApiProperty()
  departureDateTime: string;

  @ApiProperty()
  arrivalDateTime: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  availableSeats: string[];

  @ApiProperty()
  bookedSeats: string[];
}

class IBusDetails {
  @ApiProperty()
  busType: string;

  @ApiProperty()
  operatorName: string;

  @ApiProperty()
  plateNumber: string;

  @ApiProperty()
  totalSeats: number;
}

class IRouteDetails {
  @ApiProperty()
  routeName: string;

  @ApiProperty()
  distanceKm: number;

  @ApiProperty()
  estimatedTime: string;
}
