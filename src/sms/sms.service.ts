
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Smsir } from 'sms-typescript/lib';
import { GetSmsLogs } from 'src/phone/dto/getSmsLogs.dto';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { SmsLog, SmsLogDocument } from './schemas/smsLog.schema';

@Injectable()
export class SmsService {
  private sendService: any;
  constructor(@InjectModel(SmsLog.name) private logModel: Model<SmsLogDocument>,) {
    this.sendService = new Smsir(process.env.SMSIR_API_KEY, +process.env.SMSIR_NUMBER)
  }

  async sendOtpCode(phone: string, token: string) {
    return await this.sendService.SendVerifyCode(phone, process.env.SMSIR_TEMPLATE, [{ name: "CODE", value: token }])
  }

  async sendTextMessage(phone: PhoneNumber, text: string, user: User) {
    await this.logModel.create({ phoneID: phone._id, text, sentBy: user })
    await this.sendService.SendBulk(text, [phone.value])
    return true
  }

  async logs(phone: PhoneNumber) {
    return await this.logModel.find({ phoneID: phone._id }).populate("sentBy", ["fullName"])
  }
}
