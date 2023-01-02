import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VerifyPhoneDto } from './dto/verifyPhone.dto';
import { SendVerifyPhoneDto } from './dto/sendVerifyPhone.dto';
import { MUST_PHONE_VERIFY } from 'src/config/main';
import { SmsService } from 'src/sms/sms.service';
import { PhoneNumber, PhoneNumberDocument } from './schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { Office } from 'src/office/schemas/office.schema';

import * as speakeasy from 'speakeasy';
import moment from 'moment';

@Injectable()
export class PhoneService {
  constructor(
    @InjectModel(PhoneNumber.name) private model: Model<PhoneNumberDocument>,
    private smsService: SmsService,
  ) {}

  // --> token & secret
  generateSecret() {
    return speakeasy.generateSecret({ length: 30 }).base32;
  }
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
    if (!_query.secret) _query.secret = this.generateSecret();
    if (autoVerify) _query.verified = true;
    await _query.save();
    // ### must verify
    if (!_query.verified && mustVerify) {
      await this.verifyRequest({ phone: value });
    }
    return _query;
  }

  // --> find
  async find(value: string) {
    const data = await this.model.findOne({ value }).exec();
    if (!data) throw new NotAcceptableException('Not found');
    return data;
  }

  async verifyRequest(data: SendVerifyPhoneDto) {
    const { phone } = data;
    const _query = await this.find(phone);
    // generate token -->
    const token = this.generateToken(_query.secret);
    // send verification -->
    await this.smsService.verification(_query.user || _query.office, token);
    return true;
  }
  async checkValid(data: VerifyPhoneDto) {
    const { phone, token } = data;
    const _query = await this.find(phone);
    const verified = this.validationToken(_query.secret, token);
    if (verified) return _query;
    throw new NotAcceptableException('Entered token is incorrect or expired!');
  }
  async verify(data: VerifyPhoneDto) {
    const _query = await this.checkValid(data);
    _query.verified = true;
    _query.verifiedAt = moment().toDate();
    await _query.save();
    return true;
  }
}
