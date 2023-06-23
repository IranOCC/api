import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Office } from 'src/office/schemas/office.schema';
import { GetMailLogsDto } from './dto/getMailLogs.dto';
import { SendMailDto } from './dto/sendMail.dto';
import { EmailAddress, EmailAddressDocument } from './schemas/email.schema';
import { User } from 'src/user/schemas/user.schema';
import { OfficeService } from 'src/office/office.service';
import { MailService } from './mail.service';
import { generateToken, validationToken } from 'src/utils/helper/token.helper';
import { EmailOtpConfirmDto } from 'src/auth/dto/emailOtpConfirm.dto';
import { useForEnum } from 'src/utils/enum/useFor.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailAddress.name) private model: Model<EmailAddressDocument>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => OfficeService)) private officeService: OfficeService,
    private mailService: MailService,
  ) { }


  // setup email
  async setup(value: string, useFor: useForEnum = useForEnum.User, owner: User | Office, verified = false): Promise<any> {
    const check = await this.model.findOne({ value })
      .select(["value", "verified", "user", "office"])
      .populate(['office', 'user']);

    let _query: EmailAddress;

    if (check) {
      if (useFor === useForEnum.Office && ((!check.user && !check.office) || owner._id.equals((check.office as Office)._id))) {
        _query = check;
        _query.office = owner._id
        _query.user = null
      }
      else if (useFor === useForEnum.User && ((!check.user && !check.office) || owner._id.equals((check.user as User)._id))) {
        _query = check;
        _query.office = null
        _query.user = owner._id
      }
      else throw 'InUsed';
    } else {
      _query = new this.model({ value, verified });
      if (useFor === useForEnum.User) _query.user = owner._id;
      if (useFor === useForEnum.Office) _query.office = owner._id;
    }

    _query.verified = !!verified

    await _query.save();
    return _query;
  }




  // find email
  async find(value: string, useFor: useForEnum = useForEnum.User) {
    const data = await this.model
      .findOne({ value })
      .select(['user', 'office'])
      .exec();
    if (!data) throw 'Not found';
    return data;
  }









  // send otp
  async sendOtpCode(email: string) {
    const _query = await this.model
      .findOne({ value: email })
      .select(['secret', 'value', 'user', 'office'])
      .populate("user", "-email")
      .exec();
    const token = generateToken(_query.secret);
    return await this.mailService.sendOtpCode(_query, token);
  }

  // confirm otp
  async confirmOtpCode({ email, token }: EmailOtpConfirmDto) {
    const _query = await this.model
      .findOne({ value: email })
      .select(['secret'])
      .exec();
    const isValid = validationToken(_query.secret, token);
    // if not verified => do verify
    if (isValid) await this.doVerify(email)
    return isValid
  }

  // verify email
  async doVerify(email: string) {
    const _query = await this.model
      .findOne({ value: email })
      .exec();
    // if not verified => do verify
    if (!_query.verified) {
      _query.verified = true
      await _query.save()
    }
  }





















  // ===================================================================================

  // send mail
  async sendMail(data: SendMailDto, sentBy: User) {
    let _email: EmailAddress | null = null
    if (data.user) {
      const u = await this.userService.getUserForMailService(data.user)
      if (!u || !u?.email) {
        throw new NotFoundException("Email address not found", "EmailAddressNotFound")
      }
      _email = (u.email as EmailAddress)
    }
    else if (data.office) {
      const o = await this.officeService.getOfficeForMailService(data.office)
      if (!o || !o?.email) {
        throw new NotFoundException("Email address not found", "EmailAddressNotFound")
      }
      _email = (o.email as EmailAddress)
    }
    else if (data.email) {
      const email = await this.model.findById(data.email).populate("user", "-email")
      if (!email) {
        throw new NotFoundException("Email address not found", "EmailAddressNotFound")
      }
      _email = email
    }
    else {
      throw new NotAcceptableException("Email address invalid", "EmailAddressInvalid")
    }

    // ==> send
    return await this.mailService.sendSingleMail(_email, data.template, data.context, sentBy, data.relatedTo, data.relatedToID)
  }

  // --> get mail logs
  async getMailLogs(data: GetMailLogsDto) {
    let _email: EmailAddress | null = null
    if (data.user) {
      const u = await this.userService.getUserForMailService(data.user)
      if (!u || !u?.email) {
        throw new NotFoundException("Email address not found", "EmailAddressNotFound")
      }
      _email = (u.email as EmailAddress)
    }
    else if (data.office) {
      const o = await this.officeService.getOfficeForMailService(data.office)
      if (!o || !o?.email) {
        throw new NotFoundException("Email address not found", "EmailAddressNotFound")
      }
      _email = (o.email as EmailAddress)
    }
    else if (data.email) {
      const email = await this.model.findById(data.email).populate("user", "-email")
      if (!email) {
        throw new NotFoundException("Email address not found", "EmailAddressNotFound")
      }
      _email = email
    }
    else {
      throw new NotAcceptableException("Email address invalid", "EmailAddressInvalid")
    }

    // logs
    return await this.mailService.logs(_email, data.relatedTo, data.relatedToID)
  }





















  // remove
  async remove(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id })
  }



}
