import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule extends BaseSchema {
  @Prop({ required: true })
  busId: string;

  @Prop({ required: true })
  routeId: string;

  @Prop({ required: true })
  departureDateTime: string;

  @Prop({ required: true })
  arrivalDateTime: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  seatLayout: string;

  @Prop({ required: true })
  availableSeats: string[];

  @Prop({ required: true })
  bookedSeats: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
