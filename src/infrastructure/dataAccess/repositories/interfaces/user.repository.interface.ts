import { IListUserInput } from 'src/infrastructure/serviceInterfaces/user.service.interface';
import { User, UserDocument } from '../../schemas/user.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface IUserRepository
  extends IGenericRepository<User, UserDocument> {
  listUserByPagination(
    input: IListUserInput,
  ): Promise<IListUserByPaginationResponse>;
}

export interface IListUserByPaginationResponse {
  data: User[];
  total: number;
}
