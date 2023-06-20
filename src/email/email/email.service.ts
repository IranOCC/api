import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as speakeasy from 'speakeasy';
import { MailService } from '../mail/mail.service';
import { UserService } from 'src/user/user.service';
import { useForEnum } from 'src/auth/enum/useFor.enum';
import { Office } from 'src/office/schemas/office.schema';
import { GetMailLogs } from './dto/getMailLogs.dto';
import { SendMailDto } from './dto/sendMail.dto';
import { EmailAddress, EmailAddressDocument } from './schemas/email.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailAddress.name) private model: Model<EmailAddressDocument>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private mailService: MailService,
  ) { }


  // * setup email
  async setup(value: string, useFor: useForEnum = useForEnum.User, owner: User | Office, verified = false): Promise<any> {
    const check = await this.model.findOne({ value }).select(["value", "verified", "user", "office"]).populate(['office', 'user']);

    let _query: EmailAddress;

    if (check) {
      if (useFor === useForEnum.Office && ((!check.user && !check.office) || owner._id.equals(check.office._id))) {
        _query = check;
        _query.office = owner._id
        _query.user = null
      }
      else if (useFor === useForEnum.User && ((!check.user && !check.office) || owner._id.equals(check.user._id))) {
        _query = check;
        _query.office = null
        _query.user = owner._id
      }
      else {
        throw 'Exists';
      }
    } else {
      _query = new this.model({ value, verified });
      if (useFor === useForEnum.User) _query.user = owner._id;
      if (useFor === useForEnum.Office) _query.office = owner._id;
    }

    _query.verified = !!verified

    await _query.save();
    return _query;
  }

  async find(value: string, useFor: useForEnum = useForEnum.User) {
    const data = await this.model
      .findOne({ value })
      .select(['user', 'office'])
      .exec();

    if (!data) throw 'Not found';
    return data;
  }

  // --> token & secret
  generateToken(secret: string): string {
    return speakeasy.totp({ secret, encoding: 'base32', digits: 6 });
  }
  validationToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({ secret, encoding: 'base32', token });
  }

  // --> send mail
  async sendMail(data: SendMailDto, user: User) {
    if (data.userID) {
      const u = await this.userService.findOne(data.userID)
      if (!u || !u?.email) throw new NotFoundException("Email address not found")
      return await this.mailService.sendTextMessage(u.email, data.text, user)
    }
    else if (data.officeID) {
      // TODO: for office
    }
    else if (data.emailID) {
      const email = await this.model.findById(data.emailID)
      if (!email) throw new NotFoundException("Email address not found")
      return await this.mailService.sendTextMessage(email, data.text, user)
    }
    else if (data.emailAddress) {
      let email = await this.model.findOne({ value: data.emailAddress });
      if (!email) {
        email = new this.model({ value: data.emailAddress });
        await email.save()
      }
      return await this.mailService.sendTextMessage(email, data.text, user)
    }
    else {
      throw new NotAcceptableException("Email address invalid")
    }
  }

  // --> get mail logs
  async getMailLogs(data: GetMailLogs) {
    if (data.userID) {
      const u = await this.userService.findOne(data.userID)
      if (!u || !u?.email) throw new NotFoundException("Email address not found")
      return await this.mailService.logs(u.email)
    }
    else if (data.officeID) {
      // TODO: for office
    }
    else if (data.emailID) {
      const email = await this.model.findById(data.emailID)
      if (!email) throw new NotFoundException("Email address not found")
      return await this.mailService.logs(email)
    }
    else if (data.emailAddress) {
      let email = await this.model.findOne({ value: data.emailAddress });
      if (!email) {
        email = new this.model({ value: data.emailAddress });
        await email.save()
      }
      return await this.mailService.logs(email)
    }
    else {
      throw new NotAcceptableException("Email address invalid")
    }
  }


  // remove
  async remove(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id })
  }



}
