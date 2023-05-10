import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Icon extends Document {
  @Prop({ required: true, })
  name: string;

  @Prop({ required: true, })
  content: string;
}

export const IconSchema = SchemaFactory.createForClass(Icon);
export type IconDocument = HydratedDocument<Icon>;