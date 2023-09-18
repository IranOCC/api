import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Estate, EstateSchema } from 'src/estate/estate/schemas/estate.schema';
import { BlogPost, BlogPostSchema } from 'src/blog/post/schemas/blogPost.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Office, OfficeSchema } from 'src/office/schemas/office.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estate.name, schema: EstateSchema }]),
    MongooseModule.forFeature([{ name: BlogPost.name, schema: BlogPostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Office.name, schema: OfficeSchema }]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
