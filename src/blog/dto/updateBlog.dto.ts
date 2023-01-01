import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './createBlog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
