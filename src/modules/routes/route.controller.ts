import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { IRouteService } from 'src/infrastructure/serviceInterfaces/Route.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { CreateRouteInput } from './dto/route.input.dto';
import { CreateRouteResponse } from './dto/route.output.dto';

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
}
