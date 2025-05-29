import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty()
  message: string;
}

export class DeleteResponse extends CreateUserResponse {}

export class FindUserResponse {
  @ApiProperty()
  data: UserByIdResponse[];

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

export class UserByIdResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phoneNumber: string;
}
