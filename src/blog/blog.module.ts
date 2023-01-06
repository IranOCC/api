import { Module } from '@nestjs/common';
import { PostService } from './modules/post/post.service';
import { PostController } from './modules/post/post.controller';

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class BlogModule {}
