
import { Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SmsTemplate, SmsTemplateDocument } from 'src/phone/schemas/sms_template.schema';
import { CreateSmsTemplateDto } from '../dto/createSmsTemplate.dto';
import { UpdateSmsTemplateDto } from '../dto/updateSmsTemplate.dto';





@Injectable()
export class SmsTemplateService {

  constructor(
    @InjectModel(SmsTemplate.name) private templateModel: Model<SmsTemplateDocument>
  ) { }

  create(data: CreateSmsTemplateDto) {
    this.templateModel.create(data)
      .catch((err) => {
        console.log("h", err);

      })
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
