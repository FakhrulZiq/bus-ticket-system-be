import { Location, LocationDocument } from '../../schemas/Location.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface ILocationRepository
  extends IGenericRepository<Location, LocationDocument> {}
