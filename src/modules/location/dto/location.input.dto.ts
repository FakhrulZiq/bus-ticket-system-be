import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationInput {
  @ApiProperty()
  state: string;

  @ApiProperty()
  terminal: string;

  @ApiProperty()
  shortFrom: string;
}
