import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, NotFoundException, } from '@nestjs/common';
import { CurrentUser, User, UserDocument } from '../schemas/user.schema';
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


  async autoComplete(query: AutoCompleteDto, filter: any) {
    filter.firstName = { $ne: null }
    const virtualFields = {
      fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
    const searchFields = "fullName"
    const displayPath = "fullName"
    return await listAutoComplete(this.userModel, query, searchFields, displayPath, virtualFields, filter)
  }

  statics(subject: string) {
    const data = { roles: RoleEnum }
    return translateStatics(this.i18n, `user.${subject}`, data[subject]) || {}
  }

  // actions: create update findOne find remove
  async checking(user: CurrentUser, action: string, id?: string) {
    // check is SuperAdmin
    if (!user.roles.includes(RoleEnum.SuperAdmin) || !user.roles.includes(RoleEnum.Admin)) {
      return {
        allowSubmit: false,
        firstName: { disabled: true },
        lastName: { disabled: true },
        roles: { disabled: true },
        avatar: { disabled: true },
        phone: {
          value: { disabled: true },
          verified: { disabled: true },
        },
        email: {
          value: { disabled: true },
          verified: { disabled: true },
        },
        province: { disabled: true },
        city: { disabled: true },
        address: { disabled: true },
        location: { disabled: true },
        verified: { disabled: true },
        active: { disabled: true },
        dontShowPhoneNumber: { disabled: true }
      }
    }
    if (action === "create") {
      return {
        allowSubmit: true,
        firstName: { disabled: false },
        lastName: { disabled: false },
        roles: {
          disabled: false,
          default: [RoleEnum.User],
          disabledItems: user.roles.includes(RoleEnum.SuperAdmin)
            ?
            []
            :
            [
              RoleEnum.Admin,
              RoleEnum.SuperAdmin,
            ]
        },
        avatar: { disabled: false },
        phone: {
          value: { disabled: false },
          verified: { disabled: false },
        },
        email: {
          value: { disabled: false },
          verified: { disabled: false },
        },
        province: { disabled: false, default: "مازندران" },
        city: { disabled: false, default: "چالوس" },
        address: { disabled: false },
        location: { disabled: false, default: "36.699735, 51.196246" },
        verified: { disabled: false, default: false },
        active: { disabled: false, default: true },
        dontShowPhoneNumber: { disabled: false, default: false }
      }
    }
    if (action === "update") {

      const doc = await this.userModel.findById(id)
      if (!doc) throw new NotFoundException("User not found", "UserNotFound")

      const deny = !user.roles.includes(RoleEnum.SuperAdmin) && (doc.roles.includes(RoleEnum.SuperAdmin) || doc.roles.includes(RoleEnum.Admin))
      return {
        allowSubmit: !deny,
        firstName: { disabled: deny },
        lastName: { disabled: deny },
        roles: {
          disabled: deny,
          disabledItems: user.roles.includes(RoleEnum.SuperAdmin)
            ?
            []
            :
            [
              RoleEnum.Admin,
              RoleEnum.SuperAdmin,
            ]
        },
        avatar: { disabled: deny },
        phone: {
          value: { disabled: deny },
          verified: { disabled: deny },
        },
        email: {
          value: { disabled: deny },
          verified: { disabled: deny },
        },
        province: { disabled: deny },
        city: { disabled: deny },
        address: { disabled: deny },
        location: { disabled: deny, default: "36.699735, 51.196246" },
        verified: { disabled: deny },
        active: { disabled: deny },
        dontShowPhoneNumber: { disabled: deny }
      }

    }
  }

}
