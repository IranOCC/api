import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { Office, OfficeDocument } from '../schemas/office.schema';






@Injectable()
export class OfficeServiceTools {
  constructor(
    private i18n: I18nService,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto, filter: any) {
    const virtualFields = {}
    const searchFields = "name"
    const displayPath = "name"
    return await listAutoComplete(this.officeModel, query, searchFields, displayPath, virtualFields, filter)
  }

  // statics(subject: string) {
  //   const data = { roles: RoleEnum }
  //   return translateStatics(this.i18n, `user.${subject}`, data[subject]) || {}
  // }

}
