import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { EstateDocumentType, EstateDocumentTypeDocument } from '../schemas/estateDocumentType.schema';
import { ObjectId } from 'mongodb';






@Injectable()
export class EstateDocumentTypeToolsService {
  constructor(
    private i18n: I18nService,
    @InjectModel(EstateDocumentType.name) private estateDocumentTypeModel: Model<EstateDocumentTypeDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto, filter: any) {
    const searchFields = "title slug description"
    const displayPath = "title"

    if (!!filter?.categories) {
      if (Array.isArray(filter.categories))
        filter.categories = { $in: filter.categories.map((v: string) => new ObjectId(v)) }
      else
        filter.categories = { $in: [new ObjectId(filter.categories)] }
    }

    return await listAutoComplete(this.estateDocumentTypeModel, query, searchFields, displayPath)
  }

}
