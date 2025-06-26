import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from '../schemas/schedule.schema';
import { GenericRepository } from './generic.repository';
import { IScheduleRepository } from './interfaces/schedule.repository.interface';
import { ICreateScheduleInput } from 'src/infrastructure/serviceInterfaces/schedule.service.interface';

@Injectable()
export class ScheduleRepository
  extends GenericRepository<Schedule, ScheduleDocument>
  implements IScheduleRepository
{
  constructor(
    @InjectModel(Schedule.name)
    private readonly _scheduleModel: Model<ScheduleDocument>,
  ) {
    super(_scheduleModel);
  }

  async isDuplicateSchedule(input: ICreateScheduleInput): Promise<boolean> {
    try {
      const isDuplicate = await this._scheduleModel.findOne({
        busNumber: input.routeId,
        departureTime: input.departureDateTime,
        arrivalTime: input.arrivalDateTime,
        route: input.routeId,
      });

      return !!isDuplicate;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
