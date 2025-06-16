import { IMessageResponse } from 'src/utilities/constant';

export interface ILocationService {
  createLocation(
    input: ICreateLocationInput,
    email: string,
  ): Promise<ICreateLocationResponse>;
  listLocation(input: IListLocationInput): Promise<IFindLocationResponse>;
  findLocationById(id: string): Promise<ILocationByID>;
}

export interface ICreateLocationInput {
  state: string;
  terminal: string;
  shortForm: string;
}

export interface IListLocationInput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface IFindLocationResponse {
  data: ILocationByID[];
  startRecord: number;
  endRecord: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  nextPage?: number;
}

export interface ILocationByID {
  id: string;
  state: string;
  terminal: string;
  shortForm: string;
}

export interface ICreateLocationResponse extends IMessageResponse {}
