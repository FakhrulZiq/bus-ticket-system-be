import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Ticket } from './ticket.schema';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: Ticket.name, required: true })
  ticketId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'SUCCESS', enum: ['SUCCESS', 'FAILED'] })
  status: string;

  @Prop()
  method: string;

  @Prop()
  transactionId: string;

  @Prop({ type: String, default: null })
  payementDate?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
