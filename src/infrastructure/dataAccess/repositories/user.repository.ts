import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { GenericRepository } from './generic.repository';
import {
  IListUserByPaginationResponse,
  IUserRepository,
} from './interfaces/user.repository.interface';
import { IListUserInput } from 'src/infrastructure/serviceInterfaces/user.service.interface';

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

  async listUserByPagination(
    input: IListUserInput,
  ): Promise<IListUserByPaginationResponse> {
    try {
      const { pageNum, pageSize, search, roles } = input;

      const skip = (pageNum - 1) * pageSize;
      const take = pageSize;

      const filter: any = {};

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
          { phoneNumber: { $regex: regex } },
        ];
      }

      if (roles && roles.length > 0) {
        filter.role = { $in: roles.map((r) => r.toLowerCase()) };
      }

      const [users, total] = await Promise.all([
        this._userModel.find(filter).skip(skip).limit(take).exec(),
        this._userModel.countDocuments(filter).exec(),
      ]);

      return {
        data: users,
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
