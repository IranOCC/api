import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { RoleEnum } from '../enum/role.enum';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';






@Injectable()
export class UserServiceTools {
  constructor(
    private i18n: I18nService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }


  async autoComplete({ initial, search, current, size }: AutoCompleteDto) {
    return await this.userModel.aggregate([
      { $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } },
      {
        $match: {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { _id: new mongoose.Types.ObjectId(initial) }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          title: "$fullName",
          value: "$_id",
          isInitial: {
            $cond: [
              { $eq: ["$_id", new mongoose.Types.ObjectId(initial)] },
              1,
              0
            ]
          }
        }
      },
      { $skip: (current - 1) * size },
      { $limit: size },
      { $sort: { isInitial: -1 } },
      { $project: { isInitial: 0 } }
    ])
  }

  statics(subject: string) {
    const data = { roles: RoleEnum }
    return translateStatics(this.i18n, `user.${subject}`, data[subject]) || {}
  }

}
