import {
  ICreateScheduleInput,
  IListScheduleInput,
} from 'src/infrastructure/serviceInterfaces/schedule.service.interface';
import { Schedule, ScheduleDocument } from '../../schemas/schedule.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface IScheduleRepository
  extends IGenericRepository<Schedule, ScheduleDocument> {
  isDuplicateSchedule(input: ICreateScheduleInput): Promise<boolean>;
  listScheduleByPagination(
    input: IListScheduleInput,
  ): Promise<IListScheduleByPaginationResponse>;
}

export interface IListScheduleByPaginationResponse {
  data: IScheduleList[];
  total: number;
}

export interface IScheduleList {
  id: string;
  busDetails: IBusDetails;
  routeDetails: IRouteDetails;
  departureDateTime: string;
  arrivalDateTime: string;
  price: number;
  availableSeats: string[];
  bookedSeats: string[];
}

interface IBusDetails {
  busType: string;
  operatorName: string;
  plateNumber: string;
  totalSeats: number;
}

interface IRouteDetails {
  id: string;
  departure: ILocationDetails;
  destination: ILocationDetails;
  distanceKm: number;
  estimatedTime: string;
}

interface ILocationDetails {
  shortForm: string;
}
