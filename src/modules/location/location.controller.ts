import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  DeleteLocationResponse,
  FindLocationResponse,
  LocationByIdResponse,
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
  createLocation(
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Location by ID' })
  getLocation(@Param('id') id: string): Promise<LocationByIdResponse> {
    return this._locationService.findLocationById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete Location by ID' })
  deleteLocation(
    @Param('id') id: string,
    @Req() req,
  ): Promise<DeleteLocationResponse> {
    const email = req.user.email;
    return this._locationService.deleteLocation(id, email);
  }
}
