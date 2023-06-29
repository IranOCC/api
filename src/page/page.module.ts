import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PageAdminController } from './admin/page.admin.controller';
import { PageAdminService } from './admin/page.admin.service';
import { Page, PageSchema } from './schemas/page.schema';




@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  controllers: [
    PageAdminController,
  ],
  providers: [
    PageAdminService,
  ],
})
export class PageModule { }
