import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { PageStatusEum } from '../enum/pageStatus.enum';


@Schema({ timestamps: true })
export class Page extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop({ type: String, enum: PageStatusEum, default: PageStatusEum.Publish })
  status: PageStatusEum;

  @Prop({ default: Date.now })
  publishedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: any;

  @Prop({
    type: [String],
  })
  tags: string[];
}

export const PageSchema = SchemaFactory.createForClass(Page);
export type PageDocument = HydratedDocument<Page>;
