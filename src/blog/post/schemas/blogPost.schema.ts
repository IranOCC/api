import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';

@Schema({ timestamps: true })
export class BlogPost extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
  })
  image: any;

  @Prop({ type: String, enum: PostStatusEum, default: PostStatusEum.Pending })
  status: PostStatusEum;

  @Prop({
    type: String,
    enum: PostVisibilityEum,
    default: PostVisibilityEum.Public,
  })
  visibility: PostVisibilityEum;

  @Prop({ select: false })
  password: string;

  @Prop({ default: false })
  pinned: boolean;

  @Prop({ default: Date.now })
  publishedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  confirmedBy: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
  })
  office: any;

  @Prop({
    type: [String],
  })
  tags: string[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BlogCategory',
  })
  categories: any[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BlogComment',
  })
  comments: any[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
export type BlogPostDocument = HydratedDocument<BlogPost>;
