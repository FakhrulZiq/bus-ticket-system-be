import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IBusService } from 'src/infrastructure/serviceInterfaces/Bus.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  CreateBusInput,
  ListBusInput,
  UpdateBusInput,
} from './dto/bus.input.dto';
import {
  BusByIdResponse,
  CreateBusResponse,
  DeleteBusResponse,
  FindBusResponse,
} from './dto/bus.output.dto';

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
  createBus(
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Bus by ID' })
  getBus(@Param('id') id: string): Promise<BusByIdResponse> {
    return this._busService.findBusById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete Bus by ID' })
  deleteBus(@Param('id') id: string, @Req() req): Promise<DeleteBusResponse> {
    const email = req.user.email;
    return this._busService.deleteBus(id, email);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Bus' })
  async updateBus(
    @Param('id') id: string,
    @Body() input: UpdateBusInput,
    @Req() req,
  ): Promise<BusByIdResponse> {
    const email = req.user.email;
    return await this._busService.updateBus(id, input, email);
  }
}
