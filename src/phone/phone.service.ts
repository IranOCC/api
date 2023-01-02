import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VerifyPhoneDto } from 'src/auth/dto/verifyPhone.dto';
import { SendVerifyPhoneDto } from 'src/auth/dto/sendVerifyPhone.dto';
import { _$RequiredVerifyPhone } from 'src/config/main';
import { SmsService } from 'src/sms/sms.service';
import { PhoneNumber, PhoneNumberDocument } from './schemas/phone.schema';
import { User } from '../user/schemas/user.schema';
import * as speakeasy from 'speakeasy';

@Injectable()
export class PhoneService {
  constructor(
    @InjectModel(PhoneNumber.name)
    private phoneNumberModel: Model<PhoneNumberDocument>,
    private smsService: SmsService,
  ) {}

  async setup(
    phone: string,
    user: User = null,
    defaultVerified = false,
    sendVerification = _$RequiredVerifyPhone,
    sendWelcome = true,
  ): Promise<any> {
    const checkPhone = await this.phoneNumberModel.findOne({ phone });
    // #
    let _phone: PhoneNumber;
    if (checkPhone) {
      if (checkPhone.user !== user._id) {
        throw new NotAcceptableException('Phone exists');
      } else {
        _phone = checkPhone;
      }
    } else {
      _phone = new this.phoneNumberModel({
        phone,
        user: user?._id,
      });
    }

    // verify
    if (defaultVerified) _phone.verified = true;
    else if (!_phone.verified) _phone.verified = false;
    await _phone.save();

    // generateSecret
    if (_phone.secret) await this.generateSecret(_phone);

    // sendWelcome
    // if (sendWelcome) await this.smsService.welcome(user);

    // sendVerification
    if (sendVerification) await this.verifyRequest({ phone });

    return _phone._id;
  }

  find(phone: string): Promise<PhoneNumber> {
    return this.phoneNumberModel.findOne({ phone }).exec();
  }

  async generateSecret(phone: PhoneNumber) {
    if (!phone.secret) {
      const secret = speakeasy.generateSecret({ length: 30 });
      phone.secret = secret.base32;
      await phone.save();
    }
  }

  // @ resend phone token
  async verifyRequest(data: SendVerifyPhoneDto): Promise<any> {
    const { phone } = data;
    const _phone: PhoneNumber = await this.phoneNumberModel.findOne({ phone });
    // #
    if (!_phone) {
      throw new NotAcceptableException('Phone not found');
    }
    // send sms
    const token = this.generateToken(_phone);
    await this.smsService.verification(_phone.user, token);
    return true;
  }

  generateToken(phone: PhoneNumber): string {
    return speakeasy.totp({
      secret: phone.secret,
      encoding: 'base32',
      digits: 6,
    });
  }

  // @ verify email
  async checkValid(data: VerifyPhoneDto): Promise<any> {
    const { phone, token } = data;
    const _phone: PhoneNumber = await this.phoneNumberModel.findOne({
      phone,
    });
    // #
    if (!_phone) {
      throw new NotAcceptableException('Phone not found');
    }
    const verified = speakeasy.totp.verify({
      secret: _phone.secret,
      encoding: 'base32',
      token,
    });
    if (verified) return _phone;
    return false;
  }
  async verify(data: VerifyPhoneDto): Promise<any> {
    const _phone = await this.checkValid(data);
    if (!_phone) throw new NotAcceptableException('Token is incorrect!');
    if (_phone) {
      _phone.verified = true;
      await _phone.save();
      return true;
    }
    return true;
  }
}
