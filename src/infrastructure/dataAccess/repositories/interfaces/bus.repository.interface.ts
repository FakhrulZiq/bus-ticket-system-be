import { Bus, BusDocument } from '../../schemas/Bus.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface IBusRepository extends IGenericRepository<Bus, BusDocument> {}
