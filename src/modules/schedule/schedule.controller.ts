import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IScheduleService } from 'src/infrastructure/serviceInterfaces/schedule.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  CreateScheduleInput,
  ListScheduleInput,
} from './dto/schedule.input.dto';
import {
  CreateScheduleResponse,
  FindScheduleResponse,
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
}
