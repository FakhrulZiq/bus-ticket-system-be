import { IMessageResponse } from 'src/utilities/constant';

export interface IBusService {
  createBus(input: ICreateBusInput, email: string): Promise<ICreateBusResponse>;
  listBus(input: IListBusInput): Promise<IFindBusResponse>;
  findBusById(id: string): Promise<IBusByID>;
  deleteBus(id: string, email: string): Promise<IDeleteBusResponse>;
  updateBus(
    id: string,
    input: IUpdateBusInput,
    email: string,
  ): Promise<IBusByID>;
}

export interface ICreateBusInput {
  plateNumber: string;
  busType: string;
  totalSeats: number;
  operatorName: string;
}

export interface IListBusInput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface IFindBusResponse {
  data: IBusByID[];
  startRecord: number;
  endRecord: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  nextPage?: number;
}

export interface IBusByID {
  id: string;
  operatorName: string;
  plateNumber: string;
  busType: string;
  totalSeats: number;
}

export interface IUpdateBusInput {
  operatorName: string;
  plateNumber: string;
  busType: string;
  totalSeats: number;
}

export interface ICreateBusResponse extends IMessageResponse {}

export interface IDeleteBusResponse extends IMessageResponse {}
