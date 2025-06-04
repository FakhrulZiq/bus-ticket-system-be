import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IScheduleService } from 'src/infrastructure/serviceInterfaces/schedule.service.interface';
import { TYPES } from 'src/utilities/constant';
import { CreateScheduleInput } from './dto/schedule.input.dto';
import { CreateScheduleResponse } from './dto/schedule.output.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('schedules')
export class ScheduleController {
  constructor(
    @Inject(TYPES.IScheduleService)
    private readonly _shceduleService: IScheduleService,
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
    return this._shceduleService.createSchedule(input, email);
  }
}
