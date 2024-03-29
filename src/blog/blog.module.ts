import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { BlogPost, BlogPostSchema } from './post/schemas/blogPost.schema';
import { BlogPostToolsController } from './post/tools/blogPost.tools.controller';
import { BlogPostToolsService } from './post/tools/blogPost.tools.service';
import { BlogPostAdminController } from './post/admin/blogPost.admin.controller';
import { BlogPostAdminService } from './post/admin/blogPost.admin.service';

import { BlogComment, BlogCommentSchema } from './comment/schemas/blogComment.schema';
import { BlogCommentAdminController } from './comment/admin/blogComment.admin.controller';
import { BlogCommentAdminService } from './comment/admin/blogComment.admin.service';
import { BlogCommentToolsController } from './comment/tools/blogComment.tools.controller';
import { BlogCommentToolsService } from './comment/tools/blogComment.tools.service';

import { BlogCategory, BlogCategorySchema } from './category/schemas/blogCategory.schema';
import { BlogCategoryAdminController } from './category/admin/blogCategory.admin.controller';
import { BlogCategoryAdminService } from './category/admin/blogCategory.admin.service';
import { BlogCategoryToolsController } from './category/tools/blogCategory.tools.controller';
import { BlogCategoryToolsService } from './category/tools/blogCategory.tools.service';
import { OfficeModule } from 'src/office/office.module';
import { BlogPostPublicService } from './post/public/blogPost.public.service';
import { BlogPostPublicController } from './post/public/blogPost.public.controller';
import { BlogCommentPublicController } from './comment/public/blogComment.public.controller';
import { BlogCommentPublicService } from './comment/public/blogComment.public.service';


@Module({
  exports: [
    BlogPostAdminService
  ],
  imports: [
    OfficeModule,
    MongooseModule.forFeature([{ name: BlogPost.name, schema: BlogPostSchema }]),
    MongooseModule.forFeature([{ name: BlogComment.name, schema: BlogCommentSchema }]),
    MongooseModule.forFeature([{ name: BlogCategory.name, schema: BlogCategorySchema }]),
  ],
  controllers: [
    BlogPostAdminController,
    BlogPostToolsController,
    BlogPostPublicController,

    BlogCommentAdminController,
    BlogCommentToolsController,
    BlogCommentPublicController,

    BlogCategoryAdminController,
    BlogCategoryToolsController,

  ],
  providers: [
    BlogPostAdminService,
    BlogPostToolsService,
    BlogPostPublicService,

    BlogCommentAdminService,
    BlogCommentToolsService,
    BlogCommentPublicService,

    BlogCategoryAdminService,
    BlogCategoryToolsService,
  ],
})
export class BlogModule { }
