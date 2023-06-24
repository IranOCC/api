import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhoneOtpConfirmDto } from 'src/auth/dto/phoneOtpConfirm.dto';
import { SendSmsDto } from './dto/sendSms.dto';
import { GetSmsLogsDto } from './dto/getSmsLogs.dto';
import { Office } from 'src/office/schemas/office.schema';
import { SmsService } from './sms/sms.service';
import { PhoneNumber, PhoneNumberDocument } from './schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { generateToken, validationToken } from 'src/utils/helper/token.helper';
import { useForEnum } from 'src/utils/enum/useFor.enum';

@Injectable()
export class PhoneService {
  constructor(
    @InjectModel(PhoneNumber.name) private model: Model<PhoneNumberDocument>,
    private smsService: SmsService,
  ) { }




  // Setup Phone
  async setup(value: string, useFor: useForEnum = useForEnum.User, owner: User | Office, verified = false): Promise<any> {
    const check = await this.model.findOne({ value })
      .select(["value", "verified", "user", "office"])
      .populate(['office', 'user']);

    let _query: PhoneNumber;
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


  // Find Phone
  async find(value: string) {
    const data = await this.model
      .findOne({ value })
      .select(['user', 'office', 'value', 'verified'])
      .exec();
    if (!data) throw 'NotFound';
    return data;
  }



  // Send Otp
  async sendOtpCode(phone: string) {
    const _query = await this.model
      .findOne({ value: phone })
      .select(['secret', 'value', 'user', 'office'])
      .populate("user", "-phone")
      .exec();
    const token = generateToken(_query.secret);
    return await this.smsService.sendOtpCode(_query, token);
  }


  // Confirm Otp
  async confirmOtpCode({ phone, token }: PhoneOtpConfirmDto) {
    const _query = await this.model
      .findOne({ value: phone })
      .select(['secret'])
      .exec();
    const isValid = validationToken(_query.secret, token);
    // if not verified => do verify
    if (isValid) await this.doVerify(phone)
    // 
    return isValid
  }

  // Verify Phone
  async doVerify(phone: string) {
    const _query = await this.model
      .findOne({ value: phone })
      .exec();
    // if not verified => do verify
    if (!_query.verified) {
      _query.verified = true
      await _query.save()
    }
  }










  // ===================================================================================

  // Send Sms
  async sendSms(data: SendSmsDto, sentBy: User) {
    let _phone: PhoneNumber | null = null
    if (data.user) {
      // const u = await this.userService.getUserForSmsService(data.user)
      // if (!u || !u?.phone) {
      //   throw new NotFoundException("Phone number not found", "PhoneNumberNotFound")
      // }
      // _phone = (u.phone as PhoneNumber)
    }
    else if (data.office) {
      // const o = await this.officeService.getOfficeForSmsService(data.office)
      // if (!o || !o?.phone) {
      //   throw new NotFoundException("Phone number not found", "PhoneNumberNotFound")
      // }
      // _phone = (o.phone as PhoneNumber)
    }
    else if (data.phone) {
      const phone = await this.model.findById(data.phone).populate("user", "-phone")
      if (!phone) {
        throw new NotFoundException("Phone number not found", "PhoneNumberNotFound")
      }
      _phone = phone
    }
    else {
      throw new NotAcceptableException("Phone address invalid", "PhoneNumberInvalid")
    }

    // ==> send
    return await this.smsService.sendSingleSms(_phone, data.template, data.context, sentBy, data.relatedTo, data.relatedToID)
  }

  // get sms logs
  async getSmsLogs(data: GetSmsLogsDto) {
    let _phone: PhoneNumber | null = null
    if (data.user) {
      // const u = await this.userService.findOne(data.user)
      // if (!u || !u?.phone) {
      //   throw new NotFoundException("Phone number not found", "PhoneNumberNotFound")
      // }
      // _phone = (u.phone as PhoneNumber)
    }
    else if (data.office) {
      // const o = await this.officeService.findOne(data.office)
      // if (!o || !o?.phone) {
      //   throw new NotFoundException("Phone number not found", "PhoneNumberNotFound")
      // }
      // _phone = (o.phone as PhoneNumber)
    }
    else if (data.phone) {
      const phone = await this.model.findById(data.phone).populate("user", "-phone")
      if (!phone) {
        throw new NotFoundException("Phone number not found", "PhoneNumberNotFound")
      }
      _phone = phone
    }
    else {
      throw new NotAcceptableException("Phone number invalid", "PhoneNumberInvalid")
    }

    // logs
    return await this.smsService.logs(_phone, data.relatedTo, data.relatedToID)
  }







}
