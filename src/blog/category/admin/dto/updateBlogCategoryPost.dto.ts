import { PartialType } from '@nestjs/swagger';
import { CreateBlogCategoryDto } from './createBlogCategoryPost.dto';

export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) { }
