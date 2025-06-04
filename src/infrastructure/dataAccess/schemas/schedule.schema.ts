import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Bus } from './bus.schema';
import { Route } from './route.schema';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: Bus.name, required: true })
  busId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Route.name, required: true })
  routeId: Types.ObjectId;

  @Prop({ required: true })
  departureDateTime: string;

  @Prop({ required: true })
  arrivalDateTime: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  seatLayout: string[];

  @Prop({ required: true })
  availableSeats: string[];

  @Prop({ required: true })
  bookedSeats: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
