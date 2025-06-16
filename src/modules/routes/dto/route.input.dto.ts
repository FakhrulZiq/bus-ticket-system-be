import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteInput {
  @ApiProperty()
  departure: string;

  @ApiProperty()
  destination: string;

  @ApiProperty()
  distanceKm: number;

  @ApiProperty()
  estimatedTime: string;
}
