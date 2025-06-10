import { IListLocationInput } from 'src/infrastructure/serviceInterfaces/location.service.interfac';
import { Location, LocationDocument } from '../../schemas/Location.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface ILocationRepository
  extends IGenericRepository<Location, LocationDocument> {
  listLocationByPagination(
    input: IListLocationInput,
  ): Promise<IListLocationByPaginationResponse>;
}

export interface IListLocationByPaginationResponse {
  data: Location[];
  total: number;
}
