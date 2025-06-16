import { IMessageResponse } from 'src/utilities/constant';

export interface IRouteService {
  createRoute(
    input: ICreateRouteInput,
    email: string,
  ): Promise<ICreateRouteResponse>;
}

export interface ICreateRouteInput {
  departure: string;
  destination: string;
  distanceKm: number;
  estimatedTime: string;
}

export interface ICreateRouteResponse extends IMessageResponse {}
