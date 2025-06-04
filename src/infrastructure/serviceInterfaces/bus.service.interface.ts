import { IMessageResponse } from 'src/utilities/constant';

export interface IBusService {
  createBus(input: ICreateBusInput, email: string): Promise<ICreateBusResponse>;
}

export interface ICreateBusInput {
  plateNumber: string;
  busType: string;
  totalSeats: number;
  operatorName: string;
}

export interface ICreateBusResponse extends IMessageResponse {}
