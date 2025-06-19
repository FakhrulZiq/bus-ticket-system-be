import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteResponse {
  @ApiProperty()
  message: string;
}

export class DeleteRouteResponse extends CreateRouteResponse {}

export class FindRouteResponse {
  @ApiProperty()
  data: RouteByIdResponse[];

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

export class RouteByIdResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  routeName: string;

  @ApiProperty()
  departureTerminal: string;

  @ApiProperty()
  destinationTerminal: string;

  @ApiProperty()
  distanceKm: number;

  @ApiProperty()
  estimatedTime: string;
}
