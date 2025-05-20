import { FilterQuery } from 'mongoose';

export interface IGenericRepository<TModel, TDocument> {
  findAll(filter: FilterQuery<TDocument>): Promise<TDocument[]>;
  findOne(filter: FilterQuery<TDocument>): Promise<TDocument | null>;
  findById(id: string): Promise<TDocument | null>;
  save(data: Partial<TModel>): Promise<TDocument>;
}
