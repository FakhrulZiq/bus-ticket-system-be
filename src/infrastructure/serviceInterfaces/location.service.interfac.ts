import { IMessageResponse } from 'src/utilities/constant';

export interface ILocationService {
  createLocation(
    input: ICreateLocationInput,
    email: string,
  ): Promise<ICreateLocationResponse>;
}

export interface ICreateLocationInput {
  state: string;
  terminal: string;
  shortFrom: string;
}

export interface ICreateLocationResponse extends IMessageResponse {}
