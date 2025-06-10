import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

export type LocationDocument = Location & Document;

@Schema({ timestamps: true })
export class Location extends BaseSchema {
  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  terminal: string;

  @Prop({ required: true })
  shortForm: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
