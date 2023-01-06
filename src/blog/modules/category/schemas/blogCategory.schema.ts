import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema()
export class BlogCategory extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
  })
  icon: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategory',
  })
  parent: any;
}

export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);
export type BlogCategoryDocument = HydratedDocument<BlogCategory>;
