import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/Location.schema';
import { GenericRepository } from './generic.repository';
import { ILocationRepository } from './interfaces/location.repository.interfac';

@Injectable()
export class LocationRepository
  extends GenericRepository<Location, LocationDocument>
  implements ILocationRepository
{
  constructor(
    @InjectModel(Location.name)
    private readonly _locationModel: Model<LocationDocument>,
  ) {
    super(_locationModel);
  }
}
