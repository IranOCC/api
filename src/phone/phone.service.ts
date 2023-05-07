import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenConfirmPhoneDto } from './dto/tokenConfirmPhone.dto';
import { TokenRequestPhoneDto } from './dto/tokenRequestPhone.dto';
import { MUST_PHONE_VERIFY } from '../config/main';
import { PhoneNumber, PhoneNumberDocument } from './schemas/phone.schema';
import { User } from '../user/schemas/user.schema';
import { Office } from '../office/schemas/office.schema';

import * as speakeasy from 'speakeasy';
import moment from 'moment';
import { useForEnum } from '../auth/enum/useFor.enum';
import { SmsService } from '../sms/sms.service';
import { PhoneOtpConfirm } from 'src/auth/dto/phoneOtpConfirm.dto';
import { SendSmsDto } from './dto/sendSms.dto';
import { UserService } from 'src/user/user.service';
import { GetSmsLogs } from './dto/getSmsLogs.dto';

@Injectable()
export class PhoneService {
  constructor(
    @InjectModel(PhoneNumber.name) private model: Model<PhoneNumberDocument>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private smsService: SmsService,
  ) { }

  async setup(value: string, useFor: useForEnum = useForEnum.User, owner: User | Office, verified = false): Promise<any> {
    const check = await this.model.findOne({ value }).select(["value", "verified", "user", "office"]).populate(['office', 'user']);

    let _query: PhoneNumber;

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

  async sendOtpCode(phone: string) {
    const _query = await this.model
      .findOne({ value: phone })
      .select(['secret', 'value'])
      .exec();

    const token = this.generateToken(_query.secret);
    return await this.smsService.sendOtpCode(_query.value, token);
  }

  async confirmOtpCode({ phone, token }: PhoneOtpConfirm) {
    const _query = await this.model
      .findOne({ value: phone })
      .select(['secret'])
      .exec();

    const isValid = this.validationToken(_query.secret, token);

    // if not verified => do verify
    if (isValid) await this.doVerify(phone)

    return isValid
  }


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


  // --> token & secret
  generateToken(secret: string): string {
    return speakeasy.totp({ secret, encoding: 'base32', digits: 6 });
  }
  validationToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret, encoding: 'base32', window: 4, token
    });
  }

  // --> send sms
  async sendSms(data: SendSmsDto, user: User) {
    if (data.userID) {
      const u = await this.userService.findOne(data.userID)
      if (!u || !u?.phone) throw new NotFoundException("Phone number not found")
      return await this.smsService.sendTextMessage(u.phone, data.text, user)
    }
    else if (data.officeID) {
      // TODO: for office
    }
    else if (data.phoneID) {
      const phone = await this.model.findById(data.phoneID)
      if (!phone) throw new NotFoundException("Phone number not found")
      return await this.smsService.sendTextMessage(phone, data.text, user)
    }
    else if (data.phoneNumber) {
      let phone = await this.model.findOne({ value: data.phoneNumber });
      if (!phone) {
        phone = new this.model({ value: data.phoneNumber });
        await phone.save()
      }
      return await this.smsService.sendTextMessage(phone, data.text, user)
    }
    else {
      throw new NotAcceptableException("Phone number invalid")
    }
  }

  // --> get sms logs
  async getSmsLogs(data: GetSmsLogs) {
    if (data.userID) {
      const u = await this.userService.findOne(data.userID)
      if (!u || !u?.phone) throw new NotFoundException("Phone number not found")
      return await this.smsService.logs(u.phone)
    }
    else if (data.officeID) {
      // TODO: for office
    }
    else if (data.phoneID) {
      const phone = await this.model.findById(data.phoneID)
      if (!phone) throw new NotFoundException("Phone number not found")
      return await this.smsService.logs(phone)
    }
    else if (data.phoneNumber) {
      let phone = await this.model.findOne({ value: data.phoneNumber });
      if (!phone) {
        phone = new this.model({ value: data.phoneNumber });
        await phone.save()
      }
      return await this.smsService.logs(phone)
    }
    else {
      throw new NotAcceptableException("Phone number invalid")
    }
  }


  // remove
  async remove(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id })
  }



}
