import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Office } from 'src/office/schemas/office.schema';
import { GetMailLogsDto } from './dto/getMailLogs.dto';
import { SendMailDto } from './dto/sendMail.dto';
import { EmailAddress, EmailAddressDocument } from './schemas/email.schema';
import { User } from 'src/user/schemas/user.schema';
import { generateToken, validationToken } from 'src/utils/helper/token.helper';
import { EmailOtpConfirmDto } from 'src/auth/dto/emailOtpConfirm.dto';
import { useForEnum } from 'src/utils/enum/useFor.enum';
import { MailService } from './mail/mail.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailAddress.name) private model: Model<EmailAddressDocument>,
    private mailService: MailService,
  ) { }


  // Setup Email
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
    }
    else {
      _query = new this.model({ value, verified });
      if (useFor === useForEnum.User) _query.user = owner._id;
      if (useFor === useForEnum.Office) _query.office = owner._id;
    }

    _query.verified = !!verified
    await _query.save();
    return _query;
  }




  // Find Email
  async find(value: string) {
    const data = await this.model
      .findOne({ value })
      .select(['user', 'office', 'value', 'verified'])
      .exec();
    if (!data) throw 'NotFound';
    return data;
  }









  // Send Otp
  async sendOtpCode(email: string) {
    const _query = await this.model
      .findOne({ value: email })
      .select(['secret', 'value', 'user', 'office'])
      .populate("user", "-email")
      .exec();
    const token = generateToken(_query.secret);
    return await this.mailService.sendOtpCode(_query, token);
  }

  // Confirm Otp
  async confirmOtpCode({ email, token }: EmailOtpConfirmDto) {
    const _query = await this.model
      .findOne({ value: email })
      .select(['secret'])
      .exec();
    const isValid = validationToken(_query.secret, token);
    // if not verified => do verify
    if (isValid) await this.doVerify(email)
    // 
    return isValid
  }

  // Verify Email
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












  // ============================================================ delete

  async remove(id: string) {
    await this.model.deleteOne({ _id: id })
  }

  async bulkRemove(id: string[]) {
    await this.model.deleteMany({ _id: { $in: id } });
  }

  async removeByUser(user: string) {
    await this.model.deleteMany({ user })
  }

  async removeByBulkUser(users: string[]) {
    await this.model.deleteMany({ user: { $in: users } })
  }

  async removeByOffice(office: string) {
    await this.model.deleteMany({ office })
  }

  async removeByBulkOffice(offices: string[]) {
    await this.model.deleteMany({ office: { $in: offices } })
  }








  // ===================================================================================

  // Send Mail
  async sendSingleMail({ email, template, context, relatedTo, relatedToID }: SendMailDto, sentBy: User) {
    // get email
    const _email = await this.model.findById(email).select(['value', 'user', 'office'])
      .populate("user", "-email")
      .populate("office", "-email")
      .exec();

    if (!_email) {
      throw new NotFoundException("Email address not found", "EmailAddressNotFound")
    }
    // ==> send
    return await this.mailService.sendSingleMail(_email, template, context, sentBy, relatedTo, relatedToID)
  }

  // Get Mail Logs
  async getMailLogs(pagination: PaginationDto, filter: any, sort: any) {
    // get email
    // const _email = await this.model.findById(email).select(['value', 'user', 'office'])
    //   .populate("user", "-email")
    //   .populate("office", "-email")
    //   .exec();

    // if (!_email) {
    //   throw new NotFoundException("Email address not found", "EmailAddressNotFound")
    // }

    // ==> get logs
    return await this.mailService.logs(pagination, filter, sort)
  }





}
