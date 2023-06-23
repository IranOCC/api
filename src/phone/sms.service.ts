
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Smsir } from 'sms-typescript/lib';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { SmsTemplatesEnum } from './enum/templates';
import { SmsLog, SmsLogDocument } from './schemas/sms_log.schema';
import Handlebars from "handlebars"
import * as fs from 'fs'
import { join } from 'path';



const TemplatesID = {
  "otp": 621415
}


@Injectable()
export class SmsService {

  private sendService: any;
  constructor(
    @InjectModel(SmsLog.name) private logModel: Model<SmsLogDocument>
  ) {
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
    this.logModel.create({
      phoneID: phone._id,
      userID: phone?.user || null,
      officeID: phone?.office || null,
      template: SmsTemplatesEnum.Otp,
      context,
      relatedTo: RelatedToEnum.Otp || null
    })
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
    this.logModel.create({
      phoneID: phone._id,
      userID: phone?.user || null,
      officeID: phone?.office || null,
      template,
      context,
      relatedTo: relatedTo || undefined,
      relatedToID: relatedToID || undefined,
      sentBy: sentBy?._id || undefined
    })
  }

  async logs(phone: PhoneNumber, relatedTo?: RelatedToEnum, relatedToID?: string) {
    return await this.logModel
      .find({ phoneID: phone._id })
      .find({ relatedTo, relatedToID })
      .populate("sentBy", ["fullName"])
  }
}
