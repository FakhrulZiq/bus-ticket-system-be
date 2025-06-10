import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Location } from './location.schema';

export type RouteDocument = Route & Document;

@Schema({ timestamps: true })
export class Route extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: Location.name, required: true })
  departure: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Location.name, required: true })
  destination: Types.ObjectId;

  @Prop()
  distanceKm: number;

  @Prop()
  estimatedTime: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
