import { IListBusInput } from 'src/infrastructure/serviceInterfaces/Bus.service.interface';
import { Bus, BusDocument } from '../../schemas/Bus.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface IBusRepository extends IGenericRepository<Bus, BusDocument> {
  listBusByPagination(
    input: IListBusInput,
  ): Promise<IListBusByPaginationResponse>;
}

export interface IListBusByPaginationResponse {
  data: Bus[];
  total: number;
}
