import { IMessageResponse } from 'src/utilities/constant';

export interface IScheduleService {
  createSchedule(
    input: ICreateScheduleInput,
    email: string,
  ): Promise<ICreateScheduleResponse>;
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

export interface ICreateScheduleResponse extends IMessageResponse {}
