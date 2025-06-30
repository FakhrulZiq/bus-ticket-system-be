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
import { IScheduleService } from 'src/infrastructure/serviceInterfaces/schedule.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  CreateScheduleInput,
  ListScheduleInput,
  UpdateScheduleInput,
} from './dto/schedule.input.dto';
import {
  CreateScheduleResponse,
  DeleteScheduleResponse,
  FindScheduleResponse,
  ScheduleByIdResponse,
} from './dto/schedule.output.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(
    @Inject(TYPES.IScheduleService)
    private readonly _scheduleService: IScheduleService,
  ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Register a new schedule' })
  createUser(
    @Body() input: CreateScheduleInput,
    @Req() req,
  ): Promise<CreateScheduleResponse> {
    const email = req.user.email;
    return this._scheduleService.createSchedule(input, email);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all Schedule' })
  listSchedule(
    @Body() input: ListScheduleInput,
  ): Promise<FindScheduleResponse> {
    return this._scheduleService.listSchedule(input);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Schedule by ID' })
  getSchedule(@Param('id') id: string): Promise<ScheduleByIdResponse> {
    return this._scheduleService.findScheduleById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Schedule' })
  async updateBus(
    @Param('id') id: string,
    @Body() input: UpdateScheduleInput,
    @Req() req,
  ): Promise<ScheduleByIdResponse> {
    const email = req.user.email;
    return await this._scheduleService.updateSchedule(id, input, email);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete Schedule by ID' })
  deleteSchedule(
    @Param('id') id: string,
    @Req() req,
  ): Promise<DeleteScheduleResponse> {
    const email = req.user.email;
    return this._scheduleService.deleteSchedule(id, email);
  }
}
