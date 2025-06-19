import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ICreateRouteInput,
  IListRouteInput,
} from 'src/infrastructure/serviceInterfaces/Route.service.interface';
import { Route, RouteDocument } from '../schemas/Route.schema';
import { GenericRepository } from './generic.repository';
import {
  IListRouteByPaginationResponse,
  IRouteList,
  IRouteRepository,
} from './interfaces/Route.repository.interface';

@Injectable()
export class RouteRepository
  extends GenericRepository<Route, RouteDocument>
  implements IRouteRepository
{
  constructor(
    @InjectModel(Route.name)
    private readonly _routeModel: Model<RouteDocument>,
  ) {
    super(_routeModel);
  }

  async isDuplicateRoute(input: ICreateRouteInput): Promise<boolean> {
    try {
      const isDuplicate = await this._routeModel.findOne({
        departure: input.departure,
        destination: input.destination,
        deletedAt: null,
      });

      return !!isDuplicate;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async listRouteByPagination(
    input: IListRouteInput,
  ): Promise<IListRouteByPaginationResponse> {
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
          { 'departureDetails.state': { $regex: regex } },
          { 'departureDetails.terminal': { $regex: regex } },
          { 'departureDetails.shortForm': { $regex: regex } },
          { 'destinationDetails.state': { $regex: regex } },
          { 'destinationDetails.terminal': { $regex: regex } },
          { 'destinationDetails.shortForm': { $regex: regex } },
        ];
      }

      const [routes, total] = await Promise.all([
        this._routeModel
          .aggregate([
            { $match: filter },
            {
              $lookup: {
                from: 'locations',
                let: { departureId: '$departure' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$id', '$$departureId'] },
                      deletedAt: null,
                    },
                  },
                  { $limit: 1 },
                ],
                as: 'departureDetails',
              },
            },
            {
              $lookup: {
                from: 'locations',
                let: { destinationId: '$destination' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$id', '$$destinationId'] },
                      deletedAt: null,
                    },
                  },
                  { $limit: 1 },
                ],
                as: 'destinationDetails',
              },
            },
            { $unwind: '$departureDetails' },
            { $unwind: '$destinationDetails' },
            { $skip: skip },
            { $limit: take },
            {
              $project: {
                id: 1,
                distanceKm: 1,
                estimatedTime: 1,
                departure: 1,
                destination: 1,
                departureDetails: {
                  id: '$departureDetails.id',
                  state: '$departureDetails.state',
                  terminal: '$departureDetails.terminal',
                  shortForm: '$departureDetails.shortForm',
                },
                destinationDetails: {
                  id: '$destinationDetails.id',
                  state: '$destinationDetails.state',
                  terminal: '$destinationDetails.terminal',
                  shortForm: '$destinationDetails.shortForm',
                },
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ])
          .exec(),
        this._routeModel.countDocuments(filter).exec(),
      ]);

      return {
        data: routes,
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getRouteByID(id: string): Promise<IRouteList> {
    try {
      const route = await this._routeModel
        .aggregate([
          { $match: { id, deletedAt: null } },
          {
            $lookup: {
              from: 'locations',
              let: { departureId: '$departure' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$id', '$$departureId'] },
                    deletedAt: null,
                  },
                },
                { $limit: 1 },
              ],
              as: 'departureDetails',
            },
          },
          {
            $lookup: {
              from: 'locations',
              let: { destinationId: '$destination' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$id', '$$destinationId'] },
                    deletedAt: null,
                  },
                },
                { $limit: 1 },
              ],
              as: 'destinationDetails',
            },
          },
          { $unwind: '$departureDetails' },
          { $unwind: '$destinationDetails' },
          {
            $project: {
              id: 1,
              distanceKm: 1,
              estimatedTime: 1,
              departure: 1,
              destination: 1,
              departureDetails: {
                id: '$departureDetails.id',
                state: '$departureDetails.state',
                terminal: '$departureDetails.terminal',
                shortForm: '$departureDetails.shortForm',
              },
              destinationDetails: {
                id: '$destinationDetails.id',
                state: '$destinationDetails.state',
                terminal: '$destinationDetails.terminal',
                shortForm: '$destinationDetails.shortForm',
              },
              createdAt: 1,
              updatedAt: 1,
            },
          },
          { $limit: 1 },
        ])
        .exec();

      return route[0] as IRouteList;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
