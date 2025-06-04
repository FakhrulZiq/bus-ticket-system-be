import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bus, BusDocument } from '../schemas/Bus.schema';
import { GenericRepository } from './generic.repository';
import { IBusRepository } from './interfaces/Bus.repository.interface';

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
}
