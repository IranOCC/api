import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema()
export class PostCategory extends Document {
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
    ref: 'PostCategory',
  })
  parent: any;
}

export const PostCategorySchema = SchemaFactory.createForClass(PostCategory);
export type PostCategoryDocument = HydratedDocument<PostCategory>;
