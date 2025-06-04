import { IMessageResponse } from 'src/utilities/constant';

export interface IScheduleService {
  createSchedule(
    input: ICreateScheduleInput,
    email: string,
  ): Promise<ICreateScheduleResponse>;
}

export interface ICreateScheduleInput {
  busNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatLayout: string;
  bookedSeats: string[];
}

export interface ICreateScheduleResponse extends IMessageResponse {}
