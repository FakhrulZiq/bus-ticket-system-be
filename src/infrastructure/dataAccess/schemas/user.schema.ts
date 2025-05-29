import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: 'PASSENGER', enum: ['PASSENGER', 'ADMIN'] })
  role: string;

  @Prop({ default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE', 'BANNED'] })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
