import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 'PASSENGER', enum: ['PASSENGER', 'ADMIN'] })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
