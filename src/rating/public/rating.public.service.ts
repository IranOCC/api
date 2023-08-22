import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { NewRatingDto } from './dto/newRating.dto';
import { Rating, RatingDocument } from '../schemas/rating.schema';




@Injectable()
export class RatingPublicService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) { }


  // New Rating
  create(data: NewRatingDto, user?: User) {
    return this.ratingModel.create({
      relatedTo: data.relatedTo,
      relatedToID: data.relatedToID,
      score: data.score,
      createdBy: user,
    })
  }




}


