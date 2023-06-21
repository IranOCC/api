import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Office } from 'src/office/schemas/office.schema';
import { GetMailLogsDto } from './dto/getMailLogs.dto';
import { SendMailDto } from './dto/sendMail.dto';
import { EmailAddress, EmailAddressDocument } from './schemas/email.schema';
import { User } from 'src/user/schemas/user.schema';
import { OfficeService } from 'src/office/office.service';
import { MailService } from './mail.service';
import { generateToken, validationToken } from 'src/utils/helper/token.helper';
import { EmailOtpConfirmRequestDto } from 'src/auth/dto/emailOtpConfirm.dto';
import { useForEnum } from 'src/utils/enum/useFor.enum';

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
      .exec();
    const token = generateToken(_query.secret);
    return await this.mailService.sendOtpCode(_query, token);
  }

  // confirm otp
  async confirmOtpCode({ email, token }: EmailOtpConfirmRequestDto) {
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




  // send mail
  async sendMail(data: SendMailDto, sentBy: User) {
    let _email: EmailAddress | null = null
    if (data.userID) {
      const u = await this.userService.findOne(data.userID).populate("email", ["user"])
      if (!u || !u?.email) {
        throw new NotFoundException({ error: "EmailAddressNotFound", message: "Email address not found" })
      }
      _email = u.email
    }
    else if (data.officeID) {
      const o = await this.officeService.findOne(data.officeID).populate("email", ["user"])
      if (!o || !o?.email) {
        throw new NotFoundException({ error: "EmailAddressNotFound", message: "Email address not found" })
      }
      _email = o.email
    }
    else if (data.emailID) {
      const email = await this.model.findById(data.emailID).select(["user"])
      if (!email) throw new NotFoundException({ error: "EmailAddressNotFound", message: "Email address not found" })
      _email = email
    }
    else {
      throw new NotAcceptableException({ error: "EmailAddressInvalid", message: "Email address invalid" })
    }

    // ==> send
    return await this.mailService.sendTextMessage(_email, data.text, sentBy, data.subject, data.subjectID)
  }

  // --> get mail logs
  async getMailLogs(data: GetMailLogsDto) {
    let _email = null
    if (data.userID) {
      const u = await this.userService.findOne(data.userID)
      if (!u || !u?.email) {
        throw new NotFoundException({ error: "EmailAddressNotFound", message: "Email address not found" })
      }
      _email = u.email
    }
    else if (data.officeID) {
      const o = await this.officeService.findOne(data.officeID)
      if (!o || !o?.email) {
        throw new NotFoundException({ error: "EmailAddressNotFound", message: "Email address not found" })
      }
      _email = o.email
    }
    else if (data.emailID) {
      const email = await this.model.findById(data.emailID)
      if (!email) throw new NotFoundException({ error: "EmailAddressNotFound", message: "Email address not found" })
      _email = email
    }
    else {
      throw new NotAcceptableException({ error: "EmailAddressInvalid", message: "Phone number invalid" })
    }

    // logs
    return await this.mailService.logs(_email, data.subject, data.subjectID)
  }


  // remove
  async remove(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id })
  }



}
