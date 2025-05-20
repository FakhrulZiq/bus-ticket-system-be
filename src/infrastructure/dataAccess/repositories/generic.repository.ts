import { Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import { IGenericRepository } from './interfaces/generic.repository.interface';

@Injectable()
export class GenericRepository<TModel, TDocument extends Document>
  implements IGenericRepository<TModel, TDocument>
{
  constructor(protected readonly model: Model<TDocument>) {}

  async findAll(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
    try {
      return await this.model.find(filter).exec();
    } catch (error) {
      throw new Error(`Failed to find documents: ${error.message}`);
    }
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error) {
      throw new Error(`Failed to find document: ${error.message}`);
    }
  }

  async findById(id: string): Promise<TDocument | null> {
    try {
      return await this.model.findById(id).exec();
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
}
