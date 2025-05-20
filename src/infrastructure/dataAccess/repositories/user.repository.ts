import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { GenericRepository } from './generic.repository';
import { IUserRepository } from './interfaces/user.repository.interface';

@Injectable()
export class UserRepository
  extends GenericRepository<User, UserDocument>
  implements IUserRepository
{
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
  ) {
    super(_userModel);
  }
}
