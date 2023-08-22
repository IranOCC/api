import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { RatingPublicController } from './public/rating.public.controller';
import { RatingPublicService } from './public/rating.public.service';




@Module({
  exports: [
  ],
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
  ],
  controllers: [
    RatingPublicController,
  ],
  providers: [
    RatingPublicService
  ],
})
export class RatingModule { }
