import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IListLocationInput } from 'src/infrastructure/serviceInterfaces/location.service.interfac';
import { Location, LocationDocument } from '../schemas/Location.schema';
import { GenericRepository } from './generic.repository';
import {
  IListLocationByPaginationResponse,
  ILocationRepository,
} from './interfaces/location.repository.interfac';

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

  async listLocationByPagination(
    input: IListLocationInput,
  ): Promise<IListLocationByPaginationResponse> {
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
          { state: { $regex: regex } },
          { terminal: { $regex: regex } },
          { shortForm: { $regex: regex } },
        ];
      }

      const [locations, total] = await Promise.all([
        this._locationModel.find(filter).skip(skip).limit(take).exec(),
        this._locationModel.countDocuments(filter).exec(),
      ]);

      return {
        data: locations,
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
