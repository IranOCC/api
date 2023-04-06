import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Office } from '../office/schemas/office.schema';
import { User } from '../user/schemas/user.schema';
import { Smsir } from 'sms-typescript/lib';

@Injectable()
export class SmsService {
  private sendService: any;
  constructor() {
    this.sendService = new Smsir(process.env.SMSIR_API_KEY, +process.env.SMSIR_NUMBER)
  }

  async sendOtpCode(phone: string, token: string) {
    return await this.sendService.SendVerifyCode(phone, process.env.SMSIR_TEMPLATE, [{ name: "CODE", value: token }])
  }
}
