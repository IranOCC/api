import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { EstateType, EstateTypeDocument } from '../schemas/estateType.schema';






@Injectable()
export class EstateTypeToolsService {
  constructor(
    private i18n: I18nService,
    @InjectModel(EstateType.name) private estateTypeModel: Model<EstateTypeDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto) {
    const searchFields = "title slug description"
    const displayPath = "title"
    return await listAutoComplete(this.estateTypeModel, query, searchFields, displayPath)
  }

}
