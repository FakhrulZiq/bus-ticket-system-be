import { Prop } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

export class BaseSchema {
  @Prop({ type: String, default: uuidv4 })
  id?: string;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: string;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt: string;

  @Prop({ type: Date, default: null })
  deletedAt?: string;

  @Prop({ type: String, default: null })
  createdBy?: string;

  @Prop({ type: String, default: null })
  updatedBy?: string;

  @Prop({ type: String, default: null })
  deletedBy?: string;
}
