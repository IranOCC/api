
import { Injectable, NotFoundException } from '@nestjs/common';
import { Smsir } from 'sms-typescript/lib';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import Handlebars from "handlebars"
import { SmsLogService } from '../sms_log/sms_log.service';
import { SmsTemplateService } from '../sms_template/sms_template.service';
import { SmsTemplate } from '../schemas/sms_template.schema';
import { PaginationDto } from 'src/utils/dto/pagination.dto';





@Injectable()
export class SmsService {

  private sendService: any;
  constructor(
    private smsLogService: SmsLogService,
    private smsTemplateService: SmsTemplateService,
  ) {
    this.sendService = new Smsir(process.env.SMSIR_API_KEY, +process.env.SMSIR_NUMBER)
  }


  async sendOtpCode(phone: PhoneNumber, token: string) {
    // get template
    const template = await this.smsTemplateService.getTemplateBySlug("otp")
    if (!template) throw new NotFoundException("Template not found", "TemplateNotFound")
    // send
    await this.sendSingleSms(phone, template, { token }, null, RelatedToEnum.User, phone.user)
  }

  async sendSingleSms(phone: PhoneNumber, template: SmsTemplate | string, context: any = {}, sentBy?: User, relatedTo?: RelatedToEnum, relatedToID?: any) {

    // get template
    let _template: SmsTemplate
    if (typeof template === "string") _template = await this.smsTemplateService.getTemplateById(template)
    else _template = template

    if (!_template) throw new NotFoundException("Template not found", "TemplateNotFound")

    if (!context.$subject) {
      context.$subject = _template.title
    }

    // send by serviceID
    if (_template.serviceID) {
      const convert = Object.keys(context).map((name) => {
        const value = context[name]
        return { name, value }
      })
      await this.sendService.SendVerifyCode(
        phone.value,
        _template.serviceID,
        convert
      )
    }
    // send by template
    else {
      let text = ""
      try {
        text = Handlebars.compile(_template.content)(context)
      } catch (error) {
        throw new NotFoundException("Template not found", "TemplateNotFound")
      }
      await this.sendService.SendBulk(text, [phone.value]);
    }

    // save logs
    this.smsLogService.create(phone, context, _template, sentBy, relatedTo, relatedToID)
  }



  async logs(pagination: PaginationDto, filter: any, sort: any) {
    return await this.smsLogService.findAll(pagination, filter, sort)
  }



}
