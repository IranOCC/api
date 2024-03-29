
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { MailLogService } from '../mail_log/mail_log.service';
import { MailTemplateService } from '../mail_template/mail_template.service';
import { EmailAddress } from '../schemas/email.schema';
import { MailTemplate } from '../schemas/mail_template.schema';
import Handlebars from "handlebars"
import { PaginationDto } from 'src/utils/dto/pagination.dto';



@Injectable()
export class MailService {

  constructor(
    private mailerService: MailerService,
    private mailLogService: MailLogService,
    private mailTemplateService: MailTemplateService,
  ) { }


  async sendOtpCode(email: EmailAddress, token: string) {
    // get template
    const template = await this.mailTemplateService.getTemplateBySlug("otp")
    if (!template) throw new NotFoundException("Template not found", "TemplateNotFound")
    // send
    await this.sendSingleMail(email, template, { token }, null, RelatedToEnum.User, email.user)
  }

  async sendSingleMail(email: EmailAddress, template: MailTemplate | string, context: any = {}, sentBy?: User, relatedTo?: RelatedToEnum, relatedToID?: any) {

    // get template
    let _template: MailTemplate
    if (typeof template === "string") _template = await this.mailTemplateService.getTemplateById(template)
    else _template = template

    if (!_template) throw new NotFoundException("Template not found", "TemplateNotFound")

    if (!context.$subject) {
      context.$subject = _template.title
    }

    // send by serviceID
    if (_template.serviceID) {
      throw new NotAcceptableException("Service not found", "ServiceNotFound")
    }
    // send by template
    else {
      let text = ""
      try {
        text = Handlebars.compile(_template.content)(context)
      } catch (error) {
        throw new NotFoundException("Template not found", "TemplateNotFound")
      }
      await this.mailerService.sendMail({
        to: email.value,
        html: text,
        subject: context.$subject,
        attachments: context.$attachments
      })
    }

    // save logs
    this.mailLogService.create(email, context, _template, sentBy, relatedTo, relatedToID)
  }



  async logs(pagination: PaginationDto, filter: any, sort: any) {
    return await this.mailLogService.findAll(pagination, filter, sort)
  }



}
