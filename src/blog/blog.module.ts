import { Module } from '@nestjs/common';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class BlogModule { }
