import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationInput {
  @ApiProperty()
  state: string;

  @ApiProperty()
  terminal: string;

  @ApiProperty()
  shortForm: string;
}

export class UpdateLocationInput extends CreateLocationInput {}

export class ListLocationInput {
  @ApiProperty()
  search?: string;

  @ApiProperty()
  pageNum?: number;

  @ApiProperty()
  pageSize?: number;
}
