import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { ObjectId } from 'mongodb';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Office, OfficeDocument } from 'src/office/schemas/office.schema';
import { PopulatedType } from 'src/utils/helper/listAggregation.helper';






@Injectable()
export class OfficeMemberServiceTools {
  constructor(
    private i18n: I18nService,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto, filter: any, user: CurrentUser, office_id: string,) {
    const virtualFields = {}
    const searchFields = "fullName"
    const displayPath = "fullName"
    const populate: PopulatedType[] = [
      ["users", "members", "firstName lastName fullName", true, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
    ]
    const newRoot = "members"
    const newRootPipelines = []

    let filterRoot: any = {}
    if (!!office_id) filterRoot._id = new ObjectId(office_id)
    return await listAutoComplete(this.officeModel, query, searchFields, displayPath, virtualFields, filter, populate, filterRoot, newRoot, newRootPipelines)
  }



}
