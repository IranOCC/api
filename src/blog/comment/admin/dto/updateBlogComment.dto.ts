import { PartialType } from '@nestjs/swagger';
import { CreateBlogCommentDto } from './createBlogComment.dto';

export class UpdateBlogCommentDto extends PartialType(CreateBlogCommentDto) { }
