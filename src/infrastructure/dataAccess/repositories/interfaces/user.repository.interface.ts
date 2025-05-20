import { User, UserDocument } from '../../schemas/user.schema';
import { IGenericRepository } from './generic.repository.interface';

export interface IUserRepository
  extends IGenericRepository<User, UserDocument> {}
