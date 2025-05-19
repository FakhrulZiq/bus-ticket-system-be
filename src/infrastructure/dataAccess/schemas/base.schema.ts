import { Prop } from '@nestjs/mongoose';

export abstract class BaseSchema {
  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: String, default: null })
  createdBy?: string;

  @Prop({ type: String, default: null })
  updatedBy?: string;

  @Prop({ type: String, default: null })
  deletedBy?: string;
}
