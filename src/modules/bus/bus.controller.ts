import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IBusService } from 'src/infrastructure/serviceInterfaces/Bus.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateBusInput, ListBusInput } from './dto/bus.input.dto';
import { CreateBusResponse, FindBusResponse } from './dto/bus.output.dto';

@Controller('bus')
export class BusController {
  constructor(
    @Inject(TYPES.IBusService)
    private readonly _busService: IBusService,
  ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Register a new Bus' })
  createUser(
    @Body() input: CreateBusInput,
    @Req() req,
  ): Promise<CreateBusResponse> {
    const email = req.user.email;
    return this._busService.createBus(input, email);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all Bus' })
  async listBus(@Body() input: ListBusInput): Promise<FindBusResponse> {
    return this._busService.listBus(input);
  }
}
