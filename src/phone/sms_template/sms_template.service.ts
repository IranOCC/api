
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Smsir } from 'sms-typescript/lib';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { SmsTemplatesEnum } from '../enum/templates';
import { SmsLog, SmsLogDocument } from '../schemas/sms_log.schema';
import Handlebars from "handlebars"
import * as fs from 'fs'
import { join } from 'path';
import { SmsTemplate, SmsTemplateDocument } from '../schemas/sms_template.schema';



const TemplatesID = {
  "otp": 621415
}


@Injectable()
export class SmsTemplateService {

  private sendService: any;
  constructor(@InjectModel(SmsTemplate.name) private smsTemplateModel: Model<SmsTemplateDocument>) {
    this.sendService = new Smsir(process.env.SMSIR_API_KEY, +process.env.SMSIR_NUMBER)
  }


  async sendOtpCode(phone: PhoneNumber, token: string) {
    const context = { token }
    // use defined template in sms.ir
    await this.sendService.SendVerifyCode(
      phone.value,
      TemplatesID.otp,
      [{ name: "token", value: token }]
    )
    // this.logModel.create({
    //   phone: phone._id,
    //   user: phone?.user || null,
    //   office: phone?.office || null,
    //   template: SmsTemplatesEnum.Otp,
    //   context,
    //   relatedTo: RelatedToEnum.Otp || null
    // })
  }

  async sendSingleSms(phone: PhoneNumber, template = SmsTemplatesEnum.NoTemplate, context: any = {}, sentBy: User, relatedTo?: RelatedToEnum, relatedToID?: string) {
    let text = ""
    try {
      const theme = fs.readFileSync(join(__dirname, 'templates', template + ".hbs"))
      const render = Handlebars.compile(theme.toString())
      text = render(context)
    } catch (error) {
      throw new NotFoundException("Template not found", "TemplateNotFound")
    }

    await this.sendService.SendBulk(
      text,
      [phone.value]
    );
    // this.logModel.create({
    //   phone: phone._id,
    //   user: phone?.user || null,
    //   office: phone?.office || null,
    //   template,
    //   context,
    //   relatedTo: relatedTo || undefined,
    //   relatedToID: relatedToID || undefined,
    //   sentBy: sentBy?._id || undefined
    // })
  }

  // async logs(phone: PhoneNumber, relatedTo?: RelatedToEnum, relatedToID?: string) {
  //   if (relatedTo && relatedToID) {
  //     return await this.logModel.find({ phone: phone._id }).find({ relatedTo, relatedToID }).populate("sentBy", ["fullName"])
  //   }
  //   if (relatedTo) {
  //     return await this.logModel.find({ phone: phone._id }).find({ relatedTo }).populate("sentBy", ["fullName"])
  //   }
  //   return await this.logModel.find({ phone: phone._id }).populate("sentBy", ["fullName"])
  // }



}
