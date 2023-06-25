
import { ConflictException, Injectable, NotAcceptableException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationError } from 'class-validator';
import { Model } from 'mongoose';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { SmsTemplate, SmsTemplateDocument } from 'src/phone/schemas/sms_template.schema';
import { CreateSmsTemplateDto } from '../dto/createSmsTemplate.dto';
import { UpdateSmsTemplateDto } from '../dto/updateSmsTemplate.dto';





@Injectable()
export class SmsTemplateService {

  constructor(
    private i18n: I18nService,
    @InjectModel(SmsTemplate.name) private templateModel: Model<SmsTemplateDocument>
  ) { }

  async create(data: CreateSmsTemplateDto) {


    try {
      // @ts-ignore
      // dtakjhasf.dlgjlskg = "fdfdh"
      await new this.templateModel(data).save()
      //   .then()
      //   .catch((err) => {
      //     throw new NotAcceptableException("Hello Gholi")
      //   })
    } catch (err) {

      // if (err.code === 11000) {
      //   const k = Object.keys(err.keyValue)
      //   const path = k[0]
      //   const val = err.keyValue[path]
      //   const _error = new ValidationError();
      //   _error.property = path;
      //   _error.constraints = {
      //     DuplicateError: this.i18n.t("exception.DuplicateError")
      //   };
      //   _error.value = val;
      //   console.log(_error);

      //   throw "Hi"
      // }
      throw new NotAcceptableException("Hello rasoul")

    }
  }


  findAll() {
    return this.templateModel.find();
  }

  findOne(id: string) {
    return this.templateModel.findById(id);
  }

  update(id: string, data: UpdateSmsTemplateDto) {
    this.templateModel.findOneAndUpdate({ _id: id }, data);
  }

  remove(id: string) {
    this.templateModel.deleteOne({ _id: id });
  }


}
