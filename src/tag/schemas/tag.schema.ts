import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tag extends Document {
  @Prop({ required: true, unique: true, trim: true, })
  name: string;

  used: number;
  view: number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
export type TagDocument = HydratedDocument<Tag>;