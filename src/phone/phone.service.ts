import { Injectable, NotAcceptableException } from '@nestjs/common';
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

@Injectable()
export class PhoneService {
  constructor(
    @InjectModel(PhoneNumber.name) private model: Model<PhoneNumberDocument>,
    private smsService: SmsService,
  ) { }

  async setup(value: string, useFor: useForEnum = useForEnum.User, owner: User | Office): Promise<any> {
    const check = await this.model.findOne({ value });
    let _query: PhoneNumber;

    if (check) {
      if (useFor === useForEnum.Office && check.office) {
        _query = check;
      }
      else if (useFor === useForEnum.User && check.user) {
        _query = check;
      }
      else {
        throw 'Exists';
      }
    } else {
      _query = new this.model({ value });
      if (useFor === useForEnum.User) _query.user = owner._id;
      else _query.office = owner._id;
    }

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


  async requestToken(data: TokenRequestPhoneDto, forWhat: useForEnum) {
    const { phone } = data;
    const _query = await this.find(phone, forWhat);
    const token = this.generateToken(_query.secret);
    return { token, query: _query };
  }
  async checkValid(data: TokenConfirmPhoneDto, forWhat: useForEnum) {
    const { phone, token } = data;
    const _query = await this.find(phone, forWhat);
    const verified = this.validationToken(_query.secret, token);
    if (verified) return _query;
    else
      throw new NotAcceptableException(
        'Entered token is incorrect or expired!',
      );
  }
  // =====>

  // --> verification endpoints
  async verifyRequest(data: TokenRequestPhoneDto, forWhat: useForEnum) {
    const { token, query } = await this.requestToken(data, forWhat);
    // await this.smsService.verification(query.user || query.office, token);
    return true;
  }
  async verifyConfirm(data: TokenConfirmPhoneDto, forWhat: useForEnum) {
    const _query = await this.checkValid(data, forWhat);
    _query.verified = true;
    _query.verifiedAt = moment().toDate();
    await _query.save();
    return true;
  }

  // --> passwordReset endpoints
  async passwordResetRequest(data: TokenRequestPhoneDto) {
    const { token, query } = await this.requestToken(data, useForEnum.User);
    // await this.smsService.resetPassword(query.user, token);
    return true;
  }
  async passwordResetConfirm(data: TokenConfirmPhoneDto) {
    return await this.checkValid(data, useForEnum.User);
  }
}
