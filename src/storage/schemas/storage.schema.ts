import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type StorageDocument = HydratedDocument<Storage>;

@Schema({ timestamps: true })
export class Storage {
  @Prop()
  title: string;

  @Prop()
  alt: string;

  @Prop()
  content: string;

  @Prop()
  excerpt: string;

  @Prop()
  bucket: string;

  @Prop()
  filename: string;

  @Prop()
  filesize: number;

  @Prop()
  mimetype: string;

  @Prop()
  dimensions: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  uploadedBy: any;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
