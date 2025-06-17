import {
  ICreateRouteInput,
  IListRouteInput,
} from 'src/infrastructure/serviceInterfaces/Route.service.interface';
import { Route, RouteDocument } from '../../schemas/route.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface IRouteRepository
  extends IGenericRepository<Route, RouteDocument> {
  isDuplicateRoute(input: ICreateRouteInput): Promise<boolean>;
  listRouteByPagination(
    input: IListRouteInput,
  ): Promise<IListRouteByPaginationResponse>;
}

export interface IListRouteByPaginationResponse {
  data: IRouteList[];
  total: number;
}

export interface IRouteList {
  id: string;
  createdAt: string;
  departure: string;
  destination: string;
  distanceKm: number;
  estimatedTime: string;
  updatedAt: Date;
  departureDetails: ILocationDetails;
  destinationDetails: ILocationDetails;
}

interface ILocationDetails {
  id: string;
  state: string;
  terminal: string;
  shortForm: string;
}
