import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Location } from './location.schema';

export type RouteDocument = Route & Document;

@Schema({ timestamps: true })
export class Route extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: Location.name, required: true })
  departure: string;

  @Prop({ type: Types.ObjectId, ref: Location.name, required: true })
  destination: string;

  @Prop()
  distanceKm: number;

  @Prop()
  estimatedTime: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
