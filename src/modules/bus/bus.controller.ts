import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IBusService } from 'src/infrastructure/serviceInterfaces/Bus.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateBusInput } from './dto/bus.input.dto';
import { CreateBusResponse } from './dto/bus.output.dto';

@Controller('bus')
export class BusController {
  constructor(
    @Inject(TYPES.IBusService)
    private readonly _shceduleService: IBusService,
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
    return this._shceduleService.createBus(input, email);
  }
}
