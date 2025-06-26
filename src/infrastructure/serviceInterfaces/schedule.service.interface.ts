import { IMessageResponse } from 'src/utilities/constant';

export interface IScheduleService {
  createSchedule(
    input: ICreateScheduleInput,
    email: string,
  ): Promise<ICreateScheduleResponse>;
  listSchedule(input: IListScheduleInput): Promise<IFindScheduleResponse>;
}

export interface ICreateScheduleInput {
  busId: string;
  routeId: string;
  departureDateTime: string;
  arrivalDateTime: string;
  price: number;
  seatLayout: string;
  bookedSeats: string[];
}

export interface IListScheduleInput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface IFindScheduleResponse {
  data: IScheduleByID[];
  startRecord: number;
  endRecord: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  nextPage?: number;
}

export interface IScheduleByID {
  id: string;
  bus: IBusDetails;
  route: IRouteDetails;
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
  routeName: string;
  distanceKm: number;
  estimatedTime: string;
}

export interface ICreateScheduleResponse extends IMessageResponse {}
