import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from '../schemas/blogPost.schema';
import { ObjectId } from 'mongodb';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';
import moment from 'moment';




@Injectable()
export class BlogPostPublicService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) { }


  // Get BlogPost
  findOneBySlugOrID(id_or_slug: string) {
    let query = ObjectId.isValid(id_or_slug) ? { _id: new ObjectId(id_or_slug) } : { slug: id_or_slug }
    query["status"] = PostStatusEum.Publish
    query["visibility"] = PostVisibilityEum.Public
    query["isConfirmed"] = true
    query["publishedAt"] = { $lte: Date.now() }

    return this.blogPostModel.findOne(query)
      .populate("categories", "title slug")
      .populate("image", "path alt title")
      .populate("author", "firstName lastName fullName")
      .select("-status -visibility -id -_id -office -isConfirmed -confirmedAt -confirmedBy -createdBy -createdAt -updatedAt -__v")
      .exec();
  }


}


