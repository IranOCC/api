import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { EstateFeature, EstateFeatureDocument } from '../schemas/estateFeature.schema';
import { ObjectId } from 'mongodb';






@Injectable()
export class EstateFeatureToolsService {
  constructor(
    private i18n: I18nService,
    @InjectModel(EstateFeature.name) private estateFeatureModel: Model<EstateFeatureDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto, filter: any) {
    const searchFields = "title slug description"
    const displayPath = "title"

    if (!!filter?.categories) {
      let m = []
      if (Array.isArray(filter.categories))
        m = filter.categories.map((v: string) => new ObjectId(v))
      else
        m = [new ObjectId(filter.categories)]
      filter = {
        $or: [
          { categories: { $exists: false } },
          { categories: { $size: 0 } },
          { categories: { $in: m } },
        ]
      }
    }


    return await listAutoComplete(this.estateFeatureModel, query, searchFields, displayPath, undefined, filter)
  }

}
