import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { RoleEnum } from '../enum/role.enum';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';






@Injectable()
export class UserServiceTools {
  constructor(
    private i18n: I18nService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }


  async autoComplete(autoData: AutoCompleteDto, filter: any) {
    const virtualFields = {
      fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
    const searchFields = "fullName"
    const displayPath = "fullName"
    return await listAutoComplete(this.userModel, autoData, searchFields, displayPath, virtualFields, filter)
  }

  statics(subject: string) {
    const data = { roles: RoleEnum }
    return translateStatics(this.i18n, `user.${subject}`, data[subject]) || {}
  }

}
