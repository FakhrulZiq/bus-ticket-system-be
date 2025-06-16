import { ICreateRouteInput } from 'src/infrastructure/serviceInterfaces/Route.service.interface';
import { Route, RouteDocument } from '../../schemas/route.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface IRouteRepository
  extends IGenericRepository<Route, RouteDocument> {
  isDuplicateRoute(input: ICreateRouteInput): Promise<boolean>;
}
