import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { EstateFavorite, EstateFavoriteDocument } from '../schemas/estateFavorite.schema';






@Injectable()
export class EstateFavoritePublicService {
  constructor(
    @InjectModel(EstateFavorite.name) private estateFavoriteModel: Model<EstateFavoriteDocument>,
  ) { }


  // add
  add(estate: string, user: User) {
    return this.estateFavoriteModel.create({
      estate: estate,
      user: user,
    })
  }


  // remove
  remove(estate: string, user: User) {
    return this.estateFavoriteModel.deleteMany({
      estate: estate,
      user: user,
    })
  }




}


