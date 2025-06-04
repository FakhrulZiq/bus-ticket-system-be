import { ICreateScheduleInput } from 'src/infrastructure/serviceInterfaces/schedule.service.interface';
import { Schedule, ScheduleDocument } from '../../schemas/schedule.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface IScheduleRepository
  extends IGenericRepository<Schedule, ScheduleDocument> {
  isDuplicateSchedule(input: ICreateScheduleInput): Promise<boolean>;
}
