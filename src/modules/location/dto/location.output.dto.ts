import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationResponse {
  @ApiProperty()
  message: string;
}

export class FindLocationResponse {
  @ApiProperty()
  data: LocationByIdResponse[];

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

export class LocationByIdResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  terminal: string;

  @ApiProperty()
  shortForm: string;
}
