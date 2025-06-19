import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IRouteService } from 'src/infrastructure/serviceInterfaces/Route.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  CreateRouteInput,
  ListRouteInput,
  UpdateRouteInput,
} from './dto/route.input.dto';
import {
  CreateRouteResponse,
  FindRouteResponse,
  RouteByIdResponse,
} from './dto/route.output.dto';

@Controller('routes')
export class RouteController {
  constructor(
    @Inject(TYPES.IRouteService)
    private readonly _routeService: IRouteService,
  ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Register a new route' })
  createRoute(
    @Body() input: CreateRouteInput,
    @Req() req,
  ): Promise<CreateRouteResponse> {
    const email = req.user.email;
    return this._routeService.createRoute(input, email);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all Route' })
  listRoute(@Body() input: ListRouteInput): Promise<FindRouteResponse> {
    return this._routeService.listRoute(input);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Route by ID' })
  getRoute(@Param('id') id: string): Promise<RouteByIdResponse> {
    return this._routeService.findRouteById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Route' })
  async updateBus(
    @Param('id') id: string,
    @Body() input: UpdateRouteInput,
    @Req() req,
  ): Promise<RouteByIdResponse> {
    const email = req.user.email;
    return await this._routeService.updateRoute(id, input, email);
  }
}
