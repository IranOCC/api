import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class BlogComment extends Document {
  @Prop()
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  author: any;

  @Prop({ type: Number, default: 0 })
  like: number;

  @Prop({ type: Number, default: 0 })
  dislike: number;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BlogComment',
  })
  responses: any[];
}

export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment);
export type BlogCommentDocument = HydratedDocument<BlogComment>;
