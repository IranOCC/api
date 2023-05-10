import { PartialType } from '@nestjs/swagger';
import { CreateBlogCategoryDto } from './createBlogCategory.dto';

export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) {}
