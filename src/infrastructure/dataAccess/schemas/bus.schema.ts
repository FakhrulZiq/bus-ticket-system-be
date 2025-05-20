import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

export type BusDocument = Bus & Document;

@Schema({ timestamps: true })
export class Bus extends BaseSchema {
  @Prop({ required: true })
  busNumber: string;

  @Prop({ required: true })
  plateNumber: string;

  @Prop({ enum: ['Standard', 'Executive'], default: 'Standard' })
  busType: string;

  @Prop({ required: true })
  totalSeats: number;

  @Prop({ required: true })
  operatorName: string;
}

export const BusSchema = SchemaFactory.createForClass(Bus);
