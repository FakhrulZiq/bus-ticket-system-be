import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ILocationService } from 'src/infrastructure/serviceInterfaces/location.service.interfac';
import {
  CreateLocationInput,
  ListLocationInput,
} from './dto/location.input.dto';
import {
  CreateLocationResponse,
  FindLocationResponse,
} from './dto/location.output.dto';

@Controller('location')
export class LocationController {
  constructor(
    @Inject(TYPES.ILocationService)
    private readonly _locationService: ILocationService,
  ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Register a new location' })
  createUser(
    @Body() input: CreateLocationInput,
    @Req() req,
  ): Promise<CreateLocationResponse> {
    const email = req.user.email;
    return this._locationService.createLocation(input, email);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all location' })
  async listLocation(
    @Body() input: ListLocationInput,
  ): Promise<FindLocationResponse> {
    return this._locationService.listLocation(input);
  }
}
