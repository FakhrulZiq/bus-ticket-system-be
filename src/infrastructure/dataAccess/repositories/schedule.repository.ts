import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ICreateScheduleInput,
  IListScheduleInput,
} from 'src/infrastructure/serviceInterfaces/schedule.service.interface';
import { Bus, BusDocument } from '../schemas/Bus.schema';
import { Route, RouteDocument } from '../schemas/Route.schema';
import { Schedule, ScheduleDocument } from '../schemas/schedule.schema';
import { GenericRepository } from './generic.repository';
import {
  IListScheduleByPaginationResponse,
  IScheduleList,
  IScheduleRepository,
} from './interfaces/schedule.repository.interface';

@Injectable()
export class ScheduleRepository
  extends GenericRepository<Schedule, ScheduleDocument>
  implements IScheduleRepository
{
  constructor(
    @InjectModel(Schedule.name)
    private readonly _scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Bus.name)
    private readonly _busModel: Model<BusDocument>,
    @InjectModel(Route.name)
    private readonly _routeModel: Model<RouteDocument>,
  ) {
    super(_scheduleModel);
  }

  async isDuplicateSchedule(input: ICreateScheduleInput): Promise<boolean> {
    try {
      const isDuplicate = await this._scheduleModel.findOne({
        busNumber: input.routeId,
        departureTime: input.departureDateTime,
        arrivalTime: input.arrivalDateTime,
        route: input.routeId,
      });

      return !!isDuplicate;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async listScheduleByPagination(
    input: IListScheduleInput,
  ): Promise<IListScheduleByPaginationResponse> {
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
          { 'busDetails.plateNumber': { $regex: regex } },
          { 'busDetails.busType': { $regex: regex } },
          { 'busDetails.operatorName': { $regex: regex } },
          { 'departureDetails.shorForm': { $regex: regex } },
          { 'destinationDetails.shorForm': { $regex: regex } },
        ];
      }

      const [schedules, total] = await Promise.all([
        this._scheduleModel
          .aggregate([
            { $match: filter },
            {
              $lookup: {
                from: 'buses',
                let: { busId: '$busId' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$id', '$$busId'] },
                      deletedAt: null,
                    },
                  },
                  {
                    $project: {
                      plateNumber: 1,
                      busType: 1,
                      operatorName: 1,
                      totalSeats: 1,
                    },
                  },
                ],
                as: 'busDetails',
              },
            },
            {
              $unwind: {
                path: '$busDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'routes',
                let: { routeId: '$routeId' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$id', '$$routeId'] },
                      deletedAt: null,
                    },
                  },
                ],
                as: 'routeDetails',
              },
            },
            {
              $unwind: {
                path: '$routeDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'locations',
                let: { departureId: '$routeDetails.departure' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$id', '$$departureId'] },
                      deletedAt: null,
                    },
                  },
                  { $project: { shortForm: 1 } },
                ],
                as: 'departureDetails',
              },
            },
            {
              $unwind: {
                path: '$departureDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'locations',
                let: { destinationId: '$routeDetails.destination' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$id', '$$destinationId'] },
                      deletedAt: null,
                    },
                  },
                  { $project: { shortForm: 1 } },
                ],
                as: 'destinationDetails',
              },
            },
            {
              $unwind: {
                path: '$destinationDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                id: 1,
                departureDateTime: 1,
                arrivalDateTime: 1,
                price: 1,
                availableSeats: 1,
                bookedSeats: 1,
                seatLayout: 1,
                busDetails: 1,
                routeDetails: {
                  id: '$routeDetails.id',
                  distanceKm: '$routeDetails.distanceKm',
                  estimatedTime: '$routeDetails.estimatedTime',
                  departure: {
                    shortForm: '$departureDetails.shortForm',
                  },
                  destination: {
                    shortForm: '$destinationDetails.shortForm',
                  },
                },
                createdAt: 1,
                updatedAt: 1,
              },
            },
            { $skip: skip },
            { $limit: take },
          ])
          .exec(),
        this._scheduleModel.countDocuments(filter).exec(),
      ]);

      return {
        data: schedules,
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getScheduleById(id: string): Promise<IScheduleList> {
    try {
      const schedule = await this._scheduleModel
        .aggregate([
          { $match: { id, deletedAt: null } },
          {
            $lookup: {
              from: 'buses',
              let: { busId: '$busId' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$id', '$$busId'] },
                    deletedAt: null,
                  },
                },
                {
                  $project: {
                    plateNumber: 1,
                    busType: 1,
                    operatorName: 1,
                    totalSeats: 1,
                  },
                },
              ],
              as: 'busDetails',
            },
          },
          { $unwind: '$busDetails' },
          {
            $lookup: {
              from: 'routes',
              let: { routeId: '$routeId' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$id', '$$routeId'] },
                    deletedAt: null,
                  },
                },
              ],
              as: 'routeDetails',
            },
          },
          { $unwind: '$routeDetails' },
          {
            $lookup: {
              from: 'locations',
              let: { departureId: '$routeDetails.departure' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$id', '$$departureId'] },
                    deletedAt: null,
                  },
                },
                {
                  $project: { shortForm: 1 },
                },
              ],
              as: 'departureDetails',
            },
          },
          { $unwind: '$departureDetails' },
          {
            $lookup: {
              from: 'locations',
              let: { destinationId: '$routeDetails.destination' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$id', '$$destinationId'] },
                    deletedAt: null,
                  },
                },
                {
                  $project: { shortForm: 1 },
                },
              ],
              as: 'destinationDetails',
            },
          },
          { $unwind: '$destinationDetails' },
          {
            $project: {
              id: 1,
              departureDateTime: 1,
              arrivalDateTime: 1,
              price: 1,
              availableSeats: 1,
              bookedSeats: 1,
              seatLayout: 1,
              busDetails: 1,
              routeDetails: {
                id: '$routeDetails.id',
                distanceKm: '$routeDetails.distanceKm',
                estimatedTime: '$routeDetails.estimatedTime',
                departure: {
                  shortForm: '$departureDetails.shortForm',
                },
                destination: {
                  shortForm: '$destinationDetails.shortForm',
                },
              },
              createdAt: 1,
              updatedAt: 1,
            },
          },
          { $limit: 1 },
        ])
        .exec();

      if (!schedule || schedule.length === 0) {
        throw new NotFoundException(`Schedule with ID ${id} not found`);
      }

      return schedule[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
