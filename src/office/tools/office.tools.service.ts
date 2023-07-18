import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, NotAcceptableException, NotFoundException, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { Office, OfficeDocument } from '../schemas/office.schema';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { ObjectId } from 'mongodb';
import { RoleEnum } from 'src/user/enum/role.enum';






@Injectable()
export class OfficeServiceTools {
  constructor(
    private i18n: I18nService,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto, filter: any, user: CurrentUser) {
    const virtualFields = {}
    const searchFields = "name"
    const displayPath = "name"

    if (!user.roles.includes(RoleEnum.SuperAdmin)) filter.members = new ObjectId(user._id)
    return await listAutoComplete(this.officeModel, query, searchFields, displayPath, virtualFields, filter)
  }

  // actions: create update findOne find remove
  async checking(user: CurrentUser, action: string, id?: string) {
    // check is SuperAdmin
    if (!user.roles.includes(RoleEnum.SuperAdmin)) {
      return {
        allowSubmit: false,
        name: { disabled: true },
        management: { disabled: true },
        description: { disabled: true },
        logo: { disabled: true },
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
      }
    }
    if (action === "create") {
      return {
        allowSubmit: true,
        name: { disabled: false },
        management: { disabled: false },
        description: { disabled: false },
        logo: { disabled: false },
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
      }
    }
    if (action === "update") {
      return {
        allowSubmit: true,
        name: { disabled: false },
        management: { disabled: false },
        description: { disabled: false },
        logo: { disabled: false },
        phone: {
          value: { disabled: false },
          verified: { disabled: false },
        },
        email: {
          value: { disabled: false },
          verified: { disabled: false },
        },
        province: { disabled: false },
        city: { disabled: false },
        address: { disabled: false },
        location: { disabled: false, default: "36.699735, 51.196246" },
        verified: { disabled: false },
        active: { disabled: false },
      }
    }
  }


}
