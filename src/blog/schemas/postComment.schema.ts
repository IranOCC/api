import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class PostComment extends Document {
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
    ref: 'PostComment',
  })
  responses: any[];
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
export type PostCommentDocument = HydratedDocument<PostComment>;
