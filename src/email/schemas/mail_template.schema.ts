import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';


@Schema({ timestamps: true })
export class MailTemplate extends Document {
  @Prop({
    required: true,
    trim: true
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    select: true,
    required: true
  })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    select: true
  })
  serviceID: string;
}

export const MailTemplateSchema = SchemaFactory.createForClass(MailTemplate);
export type MailTemplateDocument = HydratedDocument<MailTemplate>;
