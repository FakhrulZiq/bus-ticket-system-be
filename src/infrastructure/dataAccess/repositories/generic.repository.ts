import { Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { IGenericRepository } from './interfaces/generic.repository.interface';

@Injectable()
export class GenericRepository<TModel, TDocument extends Document>
  implements IGenericRepository<TModel, TDocument>
{
  constructor(protected readonly model: Model<TDocument>) {}

  private addSoftDeleteFilter(
    filter: FilterQuery<TDocument> = {},
  ): FilterQuery<TDocument> {
    return {
      ...filter,
      deletedAt: null,
    };
  }

  async findAll(filter: FilterQuery<TDocument> = {}): Promise<TDocument[]> {
    try {
      return await this.model.find(this.addSoftDeleteFilter(filter)).exec();
    } catch (error) {
      throw new Error(`Failed to find documents: ${error.message}`);
    }
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    try {
      return await this.model.findOne(this.addSoftDeleteFilter(filter)).exec();
    } catch (error) {
      throw new Error(`Failed to find document: ${error.message}`);
    }
  }

  async findById(id: string): Promise<TDocument | null> {
    try {
      return await this.model.findOne({ _id: id, deletedAt: null }).exec();
    } catch (error) {
      throw new Error(`Failed to find document by ID: ${error.message}`);
    }
  }

  async save(data: Partial<TModel>): Promise<TDocument> {
    try {
      const modelInstance = new this.model(data);
      return await modelInstance.save();
    } catch (error) {
      throw new Error(`Failed to save document: ${error.message}`);
    }
  }

  async update(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    try {
      return await this.model
        .findOneAndUpdate(this.addSoftDeleteFilter(filter), update, {
          new: true,
        })
        .exec();
    } catch (error) {
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }
}
