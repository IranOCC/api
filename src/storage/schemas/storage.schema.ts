import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';


@Schema({ timestamps: true })
export class Storage {
  @Prop({ type: String, })
  title: string;

  @Prop({ type: String, })
  alt: string;

  @Prop({ type: Number, })
  filesize: number;

  @Prop({ type: String, })
  mimetype: string;

  @Prop({ type: String, })
  dimensions: string;

  @Prop({ type: String, })
  path: string;

  @Prop({ type: String, })
  subject: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  })
  uploadedBy: any;

  @Prop({ type: Date, select: false, })
  deletedAt: Date;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
export type StorageDocument = HydratedDocument<Storage>;