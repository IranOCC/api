
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Smsir } from 'sms-typescript/lib';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { GetSmsLogsDto } from './dto/getSmsLogs.dto';
import { SmsLog, SmsLogDocument } from './schemas/sms_log.schema';

@Injectable()
export class SmsService {

  private sendService: any;
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @InjectModel(SmsLog.name) private logModel: Model<SmsLogDocument>
  ) {
    this.sendService = new Smsir(process.env.SMSIR_API_KEY, +process.env.SMSIR_NUMBER)
  }


  async sendOtpCode(phone: PhoneNumber, token: string) {
    this.logModel.create({ phoneID: phone._id, text: ("CODE" + token), subject: "otp" })
    return await this.sendService.SendVerifyCode(phone.value, process.env.SMSIR_TEMPLATE, [{ name: "CODE", value: token }])
  }

  async sendTextMessage(phone: PhoneNumber, text: string, user: User, subject: string, subjectID: string) {
    this.logModel.create({ phoneID: phone._id, text, sentBy: user, subject, subjectID })
    await this.sendService.SendBulk(text, [phone.value])
    return true
  }

  async logs(phone: PhoneNumber, subject: string, subjectID: string) {
    // PEND:test  filter
    return await this.logModel
      .find({ phoneID: phone._id })
      .find({ subject, subjectID })
      .populate("sentBy", ["fullName"])
  }
}
