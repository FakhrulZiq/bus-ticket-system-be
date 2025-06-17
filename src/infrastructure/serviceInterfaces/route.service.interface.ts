import { IMessageResponse } from 'src/utilities/constant';

export interface IRouteService {
  createRoute(
    input: ICreateRouteInput,
    email: string,
  ): Promise<ICreateRouteResponse>;
  listRoute(input: IListRouteInput): Promise<IFindRouteResponse>;
}

export interface ICreateRouteInput {
  departure: string;
  destination: string;
  distanceKm: number;
  estimatedTime: string;
}

export interface IListRouteInput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface IFindRouteResponse {
  data: IRouteByID[];
  startRecord: number;
  endRecord: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  nextPage?: number;
}

export interface IRouteByID {
  id: string;
  routeName: string;
  departureTerminal: string;
  destinationTerminal: string;
  distanceKm: number;
  estimatedTime: string;
}

export interface ICreateRouteResponse extends IMessageResponse {}
