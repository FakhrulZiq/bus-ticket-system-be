import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

export type RouteDocument = Route & Document;

@Schema({ timestamps: true })
export class Route extends BaseSchema {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop()
  distanceKm: number;

  @Prop()
  estimatedTime: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
