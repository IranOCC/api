
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Smsir } from 'sms-typescript/lib';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { SmsLog, SmsLogDocument } from './schemas/sms_log.schema';

@Injectable()
export class SmsService {

  private sendService: any;
  constructor(
    @InjectModel(SmsLog.name) private logModel: Model<SmsLogDocument>
  ) {
    this.sendService = new Smsir(process.env.SMSIR_API_KEY, +process.env.SMSIR_NUMBER)
  }


  async sendOtpCode(phone: PhoneNumber, token: string) {
    await this.sendService.SendVerifyCode(phone.value, process.env.SMSIR_TEMPLATE, [{ name: "CODE", value: token }])
    this.logModel.create({ phoneID: phone._id, userID: phone?.user || null, officeID: phone?.office || null, text: ("CODE " + token), subject: "otp" })
  }

  async sendTextMessage(phone: PhoneNumber, text: string, sentBy: User, subject: string, subjectID: string) {
    await this.sendService.SendBulk(text, [phone.value])
    this.logModel.create({ phoneID: phone._id, userID: phone?.user || null, officeID: phone?.office || null, text, sentBy, subject, subjectID })
  }

  async logs(phone: PhoneNumber, subject: string, subjectID: string) {
    // PEND:test  filter
    return await this.logModel
      .find({ phoneID: phone._id })
      .find({ subject, subjectID })
      .populate("sentBy", ["fullName"])
  }
}
