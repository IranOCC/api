import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { BlogPost } from 'src/blog/post/schemas/blogPost.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class BlogComment extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
  })
  post: BlogPost | string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogComment',
    default: null,
  })
  replyTo: BlogComment | string | null;



  // ==> createdBy
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: User | string;


  // ==> confirm
  @Prop({ default: false })
  isConfirmed: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  confirmedBy: User | string;

  @Prop({ default: null })
  confirmedAt: Date;

  @Prop({ default: false })
  pinned: boolean;
}

export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment);
export type BlogCommentDocument = HydratedDocument<BlogComment>;
