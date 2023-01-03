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

@Injectable()
export class PhoneService {
  constructor(
    @InjectModel(PhoneNumber.name) private model: Model<PhoneNumberDocument>,
    private smsService: SmsService,
  ) {}

  // --> token & secret
  generateToken(secret: string): string {
    return speakeasy.totp({ secret, encoding: 'base32', digits: 6 });
  }
  validationToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({ secret, encoding: 'base32', token });
  }

  // --> setup
  async setup(
    value: string,
    owner: User | Office,
    autoVerify = false,
    mustVerify = MUST_PHONE_VERIFY,
  ): Promise<PhoneNumber> {
    const check = await this.model.findOne({ value });
    let _query: PhoneNumber;
    if (check) {
      if (
        (check.user && owner instanceof Office) ||
        (check.office && owner instanceof User) ||
        (check.user && owner instanceof User && check.user !== owner._id) ||
        (check.office && owner instanceof Office && check.office !== owner._id)
      ) {
        throw new NotAcceptableException('Phone exists');
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
      await this.verifyRequest({ phone: value }, f);
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
    await this.smsService.verification(query.user || query.office, token);
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
    await this.smsService.resetPassword(query.user, token);
    return true;
  }
  async passwordResetConfirm(data: TokenConfirmPhoneDto) {
    return await this.checkValid(data, useForEnum.User);
  }
}
