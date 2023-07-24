import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';

@Schema({ timestamps: true })
export class BlogPost extends Document {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  excerpt: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
  })
  image: any;







  @Prop({
    type: [String],
    default: []
  })
  tags: string[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BlogCategory',
    default: []
  })
  categories: any[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BlogComment',
    default: [],
    select: false,
  })
  comments: any[];






  @Prop({
    type: String,
    enum: PostStatusEum,
    default: PostStatusEum.Publish
  })
  status: PostStatusEum;

  @Prop({
    type: String,
    enum: PostVisibilityEum,
    default: PostVisibilityEum.Public,
  })
  visibility: PostVisibilityEum;

  @Prop({ default: false })
  pinned: boolean;

  @Prop({ default: Date.now })
  publishedAt: Date;






  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  })
  author: any;


  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    required: true
  })
  office: any;



  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  })
  createdBy: any;



  // ==> confirm
  @Prop({ default: false })
  isConfirmed: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  confirmedBy: any;

  @Prop({ default: null })
  confirmedAt: Date;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
export type BlogPostDocument = HydratedDocument<BlogPost>;
