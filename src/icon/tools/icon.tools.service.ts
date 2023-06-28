import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { Icon, IconDocument } from '../schemas/icon.schema';






@Injectable()
export class IconServiceTools {
  constructor(
    private i18n: I18nService,
    @InjectModel(Icon.name) private iconModel: Model<IconDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto) {
    const searchFields = "name"
    const displayPath = "content"
    return await listAutoComplete(this.iconModel, query, searchFields, displayPath)
  }

}
