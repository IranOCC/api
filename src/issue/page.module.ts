import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PageAdminController } from './admin/page.admin.controller';
import { PageAdminService } from './admin/page.admin.service';
import { Page, PageSchema } from './schemas/issue.schema';
import { PagePublicController } from './public/page.public.controller';
import { PagePublicService } from './public/page.public.service';




@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  controllers: [
    PageAdminController,
    PagePublicController,
  ],
  providers: [
    PageAdminService,
    PagePublicService,
  ],
})
export class PageModule { }
