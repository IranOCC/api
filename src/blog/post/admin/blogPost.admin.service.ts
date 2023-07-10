import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { BlogPost, BlogPostDocument } from '../schemas/blogPost.schema';
import { CreateBlogPostDto } from './dto/createBlogPost.dto';
import { UpdateBlogPostDto } from './dto/updateBlogPost.dto';




@Injectable()
export class BlogPostAdminService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) { }


  // Create BlogPost
  create(data: CreateBlogPostDto) {
    const {
      status,
      visibility,
      pinned,
      publishedAt,

      tags,
      categories,

      createdBy,
      confirmedBy,
      office,
      ...props
    } = data


    return this.blogPostModel.create(data);
  }

  // List BlogPost
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["blogcategories", "category", "title"]
    ]
    const project = "title slug status visibility publishedAt"
    const virtualFields = {}
    const searchFields = "title slug excerpt content"
    return listAggregation(this.blogPostModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get BlogPost
  findOne(id: string) {
    return this.blogPostModel.findById(id)
      .populate(["image"])
      .exec();
  }

  // Edit BlogPost
  update(id: string, data: UpdateBlogPostDto) {
    return this.blogPostModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single BlogPost
  remove(id: string) {
    // TODO: remove other
    return this.blogPostModel.deleteOne({ _id: id })
  }

  // Remove Bulk BlogPost
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.blogPostModel.deleteMany({ _id: { $in: id } })
  }
}


