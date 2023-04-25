import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenConfirmEmailDto } from './dto/tokenConfirmEmail.dto';
import { TokenRequestEmailDto } from './dto/tokenRequestEmail.dto';
import { MUST_EMAIL_VERIFY } from '../config/main';
import { EmailAddress, EmailAddressDocument } from './schemas/email.schema';
import { User } from '../user/schemas/user.schema';
import { Office } from '../office/schemas/office.schema';

import * as speakeasy from 'speakeasy';
import moment from 'moment';
import { useForEnum } from '../auth/enum/useFor.enum';
import { MailService } from '../mail/mail.service';
import { UserService } from 'src/user/user.service';
import { GetMailLogs } from './dto/getMailLogs.dto';
import { SendMailDto } from './dto/sendMail.dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailAddress.name) private model: Model<EmailAddressDocument>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private mailService: MailService,
  ) { }

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

  // --> setup
  async setup(
    value: string,
    owner: User | Office,
    autoVerify = false,
    mustVerify = MUST_EMAIL_VERIFY,
  ): Promise<EmailAddress> {
    const check = await this.model.findOne({ value });
    let _query: EmailAddress;
    if (check) {
      if (
        (check.user && owner instanceof Office) ||
        (check.office && owner instanceof User) ||
        (check.user && owner instanceof User && check.user !== owner._id) ||
        (check.office && owner instanceof Office && check.office !== owner._id)
      ) {
        throw new NotAcceptableException('Email exists');
      } else {
        _query = check;
      }
    } else {
      _query = new this.model({ value });
      if (owner instanceof User) _query.user = owner._id;
      if (owner instanceof Office) _query.office = owner._id;
    }
    await _query.save();
    // @@@
    if (autoVerify) _query.verified = true;
    await _query.save();
    // ### must verify
    if (!_query.verified && mustVerify) {
      // eslint-disable-next-line prettier/prettier
      const f = owner instanceof User ? useForEnum.User : useForEnum.Office;
      await this.verifyRequest({ email: value }, f);
    }
    return _query;
  }

  // --> find
  async find(value: string, forWhat: string) {
    const data = await this.model
      .findOne({ value })
      .populate(['user', 'office'])
      .exec();
    const exp =
      !data ||
      (forWhat === useForEnum.User && !data.user) ||
      (forWhat === useForEnum.Office && !data.office);
    if (exp) throw new NotAcceptableException('Not found');
    return data;
  }
  async requestToken(data: TokenRequestEmailDto, forWhat: useForEnum) {
    const { email } = data;
    const _query = await this.find(email, forWhat);
    const token = this.generateToken(_query.secret);
    return { token, query: _query };
  }
  async checkValid(data: TokenConfirmEmailDto, forWhat: useForEnum) {
    const { email, token } = data;
    const _query = await this.find(email, forWhat);
    const verified = this.validationToken(_query.secret, token);
    if (verified) return _query;
    else
      throw new NotAcceptableException(
        'Entered token is incorrect or expired!',
      );
  }
  // =====>

  // --> verification endpoints
  async verifyRequest(data: TokenRequestEmailDto, forWhat: useForEnum) {
    const { token, query } = await this.requestToken(data, forWhat);
    await this.mailService.verification(query.user || query.office, token);
    return true;
  }
  async verifyConfirm(data: TokenConfirmEmailDto, forWhat: useForEnum) {
    const _query = await this.checkValid(data, forWhat);
    _query.verified = true;
    _query.verifiedAt = moment().toDate();
    await _query.save();
    return true;
  }

  // --> passwordReset endpoints
  async passwordResetRequest(data: TokenRequestEmailDto) {
    const { token, query } = await this.requestToken(data, useForEnum.User);
    await this.mailService.resetPassword(query.user, token);
    return true;
  }
  async passwordResetConfirm(data: TokenConfirmEmailDto) {
    return await this.checkValid(data, useForEnum.User);
  }
}
