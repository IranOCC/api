import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotAcceptableException, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { BlogPost, BlogPostDocument } from '../schemas/blogPost.schema';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { RoleEnum } from 'src/user/enum/role.enum';
import moment from 'moment';






@Injectable()
export class BlogPostToolsService {
  constructor(
    private i18n: I18nService,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) { }

  async autoComplete(query: AutoCompleteDto) {
    const searchFields = "title slug excerpt content"
    const displayPath = "title"
    return await listAutoComplete(this.blogPostModel, query, searchFields, displayPath)
  }


  statics(subject: string) {
    const data = { visibility: PostVisibilityEum, status: PostStatusEum }
    return translateStatics(this.i18n, `blogPost.${subject}`, data[subject]) || {}
  }


  // actions: create update findOne find remove
  async checking(user: CurrentUser, action: string, id?: string) {

    // check my offices if not superAdmin
    if (!user.roles.includes(RoleEnum.SuperAdmin)) {
      if (!user?.offices?.length) throw new NotAcceptableException("You are not member of any office", "NoOffice")
    }

    if (action === "create") {
      if (user.roles.includes(RoleEnum.SuperAdmin)) {
        return {
          allowSubmit: true,
          title: { disabled: false },
          slug: { disabled: false },
          excerpt: { disabled: false },
          content: { disabled: false },
          image: { disabled: false },
          categories: { disabled: false },
          tags: { disabled: false },
          status: {
            disabled: false,
            default: PostStatusEum.Publish,
          },
          visibility: {
            disabled: false,
            default: PostVisibilityEum.Public,
          },
          pinned: {
            disabled: false,
            default: false,
          },
          publishedAt: {
            disabled: false,
            default: new Date().toISOString(),
          },
          office: {
            disabled: false,
            default: null,
          },
          createdBy: {
            disabled: false,
            default: user._id,
          },
          // =========================
          confirmedBy: {
            disabled: false,
            default: user._id,
          },
        }
      }
      if (user.roles.includes(RoleEnum.Admin)) {
        return {
          allowSubmit: true,
          title: { disabled: false },
          slug: { disabled: false },
          excerpt: { disabled: false },
          content: { disabled: false },
          image: { disabled: false },
          categories: { disabled: false },
          tags: { disabled: false },
          status: {
            disabled: false,
            default: PostStatusEum.Publish,
          },
          visibility: {
            disabled: false,
            default: PostVisibilityEum.Public,
          },
          pinned: {
            disabled: false,
            default: false,
          },
          publishedAt: {
            disabled: false,
            default: new Date().toISOString(),
          },
          office: {
            disabled: false,
            default: user.offices[0]._id,
          },
          createdBy: {
            disabled: false,
            default: user._id,
          },
          confirmedBy: {
            disabled: false,
            default: user._id,
          },
        }
      }
      if (user.roles.includes(RoleEnum.Author)) {
        return {
          allowSubmit: true,
          title: { disabled: false },
          slug: { disabled: false },
          excerpt: { disabled: false },
          content: { disabled: false },
          image: { disabled: false },
          categories: { disabled: false },
          tags: { disabled: false },
          status: {
            disabled: true,
            default: PostStatusEum.Pending,
          },
          visibility: {
            disabled: true,
            default: PostVisibilityEum.Public,
          },
          pinned: {
            disabled: true,
            default: false,
          },
          publishedAt: {
            hidden: true,
            disabled: true,
            default: new Date().toISOString(),
          },
          office: {
            disabled: false,
            default: user.offices[0]._id,
          },
          createdBy: {
            disabled: true,
            default: user._id,
          },
          confirmedBy: {
            hidden: true,
            disabled: true,
          },
        }
      }
    }

    if (action === "update") {
      const doc = await this.blogPostModel.findById(id).populate("office")
      console.log(doc, "update doc check");

      if (user.roles.includes(RoleEnum.SuperAdmin)) {
        return {
          allowSubmit: true,
          title: { disabled: false },
          slug: { disabled: false },
          excerpt: { disabled: false },
          content: { disabled: false },
          image: { disabled: false },
          categories: { disabled: false },
          tags: { disabled: false },
          status: { disabled: false },
          visibility: { disabled: false },
          pinned: { disabled: false },
          publishedAt: { disabled: false },
          office: { disabled: false },
          createdBy: { disabled: false },
          confirmedBy: { disabled: false },
        }
      }
      // check is office management
      if (user.roles.includes(RoleEnum.Admin) && ((doc.office.management as User)._id.equals(user._id))) {
        return {
          allowSubmit: true,
          title: { disabled: false },
          slug: { disabled: false },
          excerpt: { disabled: false },
          content: { disabled: false },
          image: { disabled: false },
          categories: { disabled: false },
          tags: { disabled: false },
          status: {
            disabled: false,
          },
          visibility: {
            disabled: false,
          },
          pinned: {
            disabled: false,
          },
          publishedAt: {
            disabled: false,
          },
          office: {
            disabled: true,
          },
          createdBy: {
            disabled: false,
          },
          confirmedBy: {
            disabled: true,
          },
        }
      }
      // check is createdBy & office
      if (user.roles.includes(RoleEnum.Author) && doc.createdBy.equals(user._id) && (doc.office.members.includes(user._id))) {
        return {
          allowSubmit: !doc.confirmedBy,
          title: { disabled: !!doc.confirmedBy },
          slug: { disabled: !!doc.confirmedBy },
          excerpt: { disabled: !!doc.confirmedBy },
          content: { disabled: !!doc.confirmedBy },
          image: { disabled: !!doc.confirmedBy },
          categories: { disabled: !!doc.confirmedBy },
          tags: { disabled: !!doc.confirmedBy },
          status: { disabled: true },
          visibility: { disabled: true },
          pinned: { disabled: true },
          publishedAt: {
            hidden: !doc.confirmedBy,
            disabled: true
          },
          office: {
            disabled: !!doc.confirmedBy,
          },
          createdBy: { disabled: true },
          confirmedBy: {
            hidden: !doc.confirmedBy,
            disabled: true
          },
        }
      }



      return {
        allowSubmit: false,
        title: { disabled: true },
        slug: { disabled: true },
        excerpt: { disabled: true },
        content: { disabled: true },
        image: { disabled: true },
        categories: { disabled: true },
        tags: { disabled: true },
        status: { disabled: true },
        visibility: { disabled: true },
        pinned: { disabled: true },
        publishedAt: { disabled: true },
        office: { disabled: true },
        createdBy: { disabled: true },
        confirmedBy: { disabled: true },
      }
    }




  }

}
