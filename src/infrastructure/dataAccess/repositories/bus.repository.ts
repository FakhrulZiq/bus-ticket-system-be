import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IListBusInput } from 'src/infrastructure/serviceInterfaces/Bus.service.interface';
import { Bus, BusDocument } from '../schemas/Bus.schema';
import { GenericRepository } from './generic.repository';
import {
  IBusRepository,
  IListBusByPaginationResponse,
} from './interfaces/Bus.repository.interface';

@Injectable()
export class BusRepository
  extends GenericRepository<Bus, BusDocument>
  implements IBusRepository
{
  constructor(
    @InjectModel(Bus.name)
    private readonly _busModel: Model<BusDocument>,
  ) {
    super(_busModel);
  }

  async listBusByPagination(
    input: IListBusInput,
  ): Promise<IListBusByPaginationResponse> {
    try {
      const { pageNum, pageSize, search } = input;

      const skip = (pageNum - 1) * pageSize;
      const take = pageSize;

      const filter: any = {
        deletedAt: null,
      };

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { plateNumber: { $regex: regex } },
          { busType: { $regex: regex } },
          { operatorName: { $regex: regex } },
        ];
      }

      const [Buses, total] = await Promise.all([
        this._busModel.find(filter).skip(skip).limit(take).exec(),
        this._busModel.countDocuments(filter).exec(),
      ]);

      return {
        data: Buses,
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
