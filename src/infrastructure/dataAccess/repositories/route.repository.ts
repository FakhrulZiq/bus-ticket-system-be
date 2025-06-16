import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route, RouteDocument } from '../schemas/Route.schema';
import { GenericRepository } from './generic.repository';
import { IRouteRepository } from './interfaces/Route.repository.interface';
import { ICreateRouteInput } from 'src/infrastructure/serviceInterfaces/Route.service.interface';

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

  async isDuplicateRoute(input: ICreateRouteInput): Promise<boolean> {
    try {
      const isDuplicate = await this._routeModel.findOne({
        departure: input.departure,
        destination: input.destination,
      });

      return !!isDuplicate;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
