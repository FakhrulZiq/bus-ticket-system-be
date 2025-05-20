import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Schedule } from './schedule.schema';
import { User } from './user.schema';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Schedule.name, required: true })
  scheduleId: Types.ObjectId;

  @Prop({ required: true })
  seatNumber: string;

  @Prop({ default: 'BOOKED', enum: ['BOOKED', 'CANCELLED', 'COMPLETED'] })
  bookingStatus: string;

  @Prop({ default: 'UNPAID', enum: ['PAID', 'UNPAID'] })
  paymentStatus: string;

  @Prop()
  paymentMethod: string; // 'Online', 'Cash', etc.
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
