import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route, RouteDocument } from '../schemas/Route.schema';
import { GenericRepository } from './generic.repository';
import { IRouteRepository } from './interfaces/Route.repository.interface';

@Injectable()
export class RouteRepository
  extends GenericRepository<Route, RouteDocument>
  implements IRouteRepository
{
  constructor(
    @InjectModel(Route.name)
    private readonly _routeModel: Model<RouteDocument>,
  ) {
    super(_routeModel);
  }
}
