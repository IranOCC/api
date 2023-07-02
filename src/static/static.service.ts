import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { citiesList, provincesList } from './data';






@Injectable()
export class StaticService {
  constructor(
  ) { }

  province({ initial, search }: AutoCompleteDto, filter: any) {
    if (!Array.isArray(initial)) initial = [initial]
    return provincesList.filter(({ id, title, value }) => {
      return initial.includes(value) || title.search(search) !== -1
    })
      .map(({ title, value }) => ({ title, value }))
  }

  city({ initial, search }: AutoCompleteDto, filter: any) {
    if (!Array.isArray(initial)) initial = [initial]
    return citiesList.filter(({ id, title, value, province_id }) => {
      if (filter && filter.province) {
        const p = provincesList.filter(({ id }) => province_id === id)[0]
        return (p.title === filter.province) && (initial.includes(value) || title.search(search) !== -1)
      }
      return initial.includes(value) || title.search(search) !== -1
    }).map(({ title, value }) => ({ title, value }))
  }

}
