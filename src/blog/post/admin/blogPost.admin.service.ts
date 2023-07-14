import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { BlogPost, BlogPostDocument } from '../schemas/blogPost.schema';
import { CreateBlogPostDto } from './dto/createBlogPost.dto';
import { UpdateBlogPostDto } from './dto/updateBlogPost.dto';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { RoleEnum } from 'src/user/enum/role.enum';
import { OfficeService } from 'src/office/office.service';




@Injectable()
export class BlogPostAdminService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
    private officeService: OfficeService,
  ) { }


  // Create BlogPost
  async create(data: CreateBlogPostDto, user: CurrentUser) {

    // get office
    const _office = await this.officeService.checkOffice(data.office)


    if (user.roles.includes(RoleEnum.SuperAdmin)) {
      if (!data?.status) data.status = PostStatusEum.Publish
      if (!data?.visibility) data.visibility = PostVisibilityEum.Public
      if (!data?.createdBy) data.createdBy = user._id
      if (data.status === PostStatusEum.Publish) {
        if (!data?.publishedAt) data.publishedAt = new Date()
        if (!data?.confirmedBy) data.confirmedBy = user._id
      }
      return this.blogPostModel.create(data);
    }
    // is Admin & management of office
    else if (user.roles.includes(RoleEnum.Admin) && ((_office.management as User)._id.equals(user._id))) {
      if (!data?.status) data.status = PostStatusEum.Publish
      if (!data?.visibility) data.visibility = PostVisibilityEum.Public
      if (!data?.createdBy) data.createdBy = user._id
      if (data.status === PostStatusEum.Publish) {
        if (!data?.publishedAt) data.publishedAt = new Date()
        data.confirmedBy = user._id
      }
      return this.blogPostModel.create(data);
    }
    // is Author & member of office
    else if (user.roles.includes(RoleEnum.Author) && (_office.members.includes(user._id))) {
      data.status = PostStatusEum.Pending
      data.visibility = PostVisibilityEum.Public
      data.publishedAt = null
      data.createdBy = user._id
      return this.blogPostModel.create(data);
    }


    // throw
    throw new ForbiddenException("You don't have access to create post for this office", "NoAccessCreatePost")
  }



  // Edit BlogPost
  async update(id: string, data: UpdateBlogPostDto, user: CurrentUser) {
    const post = await this.blogPostModel.findById(id)
    if (!post) throw new NotFoundException("Post not found", "PostNotFound")

    if (user.roles.includes(RoleEnum.SuperAdmin)) {

    }

    const {
      status,
      visibility,
      publishedAt,
      pinned,

      office,
      createdBy,
      confirmedBy,
    } = data

    // const _office = await this.officeService.checkOffice(data.office)



    // // is Admin & management of office
    // else if (user.roles.includes(RoleEnum.Admin) && ((_office.management as User)._id.equals(user._id))) {
    //   if (!data?.status) data.status = PostStatusEum.Publish
    //   if (!data?.visibility) data.visibility = PostVisibilityEum.Public
    //   if (!data?.createdBy) data.createdBy = user._id
    //   if (data.status === PostStatusEum.Publish) {
    //     if (!data?.publishedAt) data.publishedAt = new Date()
    //     data.confirmedBy = user._id
    //   }
    //   return this.blogPostModel.create(data);
    // }
    // // is Author & member of office
    // else if (user.roles.includes(RoleEnum.Author) && (_office.members.includes(user._id))) {
    //   data.status = PostStatusEum.Pending
    //   data.visibility = PostVisibilityEum.Public
    //   data.publishedAt = null
    //   data.createdBy = user._id
    //   return this.blogPostModel.create(data);
    // }


    return this.blogPostModel.updateOne({ _id: id }, data).exec();
  }



  // confirm publish post
  async confirmPublish(id: string, user: CurrentUser) {
    const post = await (await this.blogPostModel.findById(id)).populate("office", "_id management")
    if (!post) throw new NotFoundException("Post not found", "PostNotFound")
    if (user.roles.includes(RoleEnum.SuperAdmin)) {
      post.status = PostStatusEum.Publish
      post.publishedAt = new Date()
      post.confirmedBy = user._id
      return await post.save()
    }
    if (user.roles.includes(RoleEnum.Admin)) {
      // check access
      if (!(post.office.management as User)._id.equals(user._id)) {
        throw new ForbiddenException("You don't have access to confirm this post", "ConfirmAccessDenied")
      }
      post.status = PostStatusEum.Publish
      post.publishedAt = new Date()
      post.confirmedBy = user._id
      return await post.save()
    }
  }


  // List BlogPost
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "confirmedBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["offices", "office", "name", false],
      ["blogcategories", "categories", "title"]
    ]
    const project = "title slug status visibility publishedAt createdAt"
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


