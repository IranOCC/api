import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { _$RequiredVerifyEmail } from 'src/config/main';
import * as speakeasy from 'speakeasy';
import { VerifyEmailDto } from 'src/auth/dto/verifyEmail.dto';
import { SendVerifyEmailDto } from 'src/auth/dto/sendVerifyEmail.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/schemas/user.schema';
import { EmailAddress, EmailAddressDocument } from './schemas/email.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailAddress.name)
    private emailAddressModel: Model<EmailAddressDocument>,
    private mailService: MailService,
  ) {}

  // @ setup email
  async setup(
    email: string,
    user: User = null,
    defaultVerified = false,
    sendVerification = _$RequiredVerifyEmail,
    sendWelcome = true,
  ): Promise<any> {
    const checkMail = await this.emailAddressModel.findOne({ email });
    // #
    let _email: EmailAddress;
    if (checkMail) {
      if (checkMail.user !== user._id) {
        throw new HttpException('Email exists', HttpStatus.NOT_ACCEPTABLE);
      } else {
        _email = checkMail;
      }
    } else {
      _email = new this.emailAddressModel({
        email,
        user: user?._id,
      });
    }

    // verify
    if (defaultVerified) _email.verified = true;
    else if (!_email.verified) _email.verified = false;
    await _email.save();

    // generateSecret
    if (_email.secret) await this.generateSecret(_email);

    // sendWelcome
    if (sendWelcome) await this.mailService.welcome(user);

    // sendVerification
    if (sendVerification) await this.verifyRequest({ email });

    return _email._id;
  }

  find(email: string): Promise<EmailAddress> {
    return this.emailAddressModel.findOne({ email }).exec();
  }

  async generateSecret(email: EmailAddress) {
    if (!email.secret) {
      const secret = speakeasy.generateSecret({ length: 30 });
      email.secret = secret.base32;
      await email.save();
    }
  }

  // @ send email token
  async verifyRequest(data: SendVerifyEmailDto): Promise<any> {
    const { email } = data;
    const _email: EmailAddress = await this.emailAddressModel.findOne({
      email,
    });
    // #
    if (!_email) {
      throw new NotAcceptableException('Email not found');
    }
    // send email
    const token = this.generateToken(_email);
    await this.mailService.verification(_email.user, token);
    return true;
  }

  generateToken(email: EmailAddress): string {
    return speakeasy.totp({
      secret: email.secret,
      encoding: 'base32',
      digits: 8,
    });
  }

  // @ verify email
  async checkValid(data: VerifyEmailDto): Promise<any> {
    const { email, token } = data;
    const _email: EmailAddress = await this.emailAddressModel.findOne({
      email,
    });
    // #
    if (!_email) {
      throw new NotAcceptableException('Email not found');
    }
    const verified = speakeasy.totp.verify({
      secret: _email.secret,
      encoding: 'base32',
      token,
    });
    if (verified) return _email;
    return false;
  }
  async verify(data: VerifyEmailDto): Promise<any> {
    const _email = await this.checkValid(data);
    if (!_email) throw new NotAcceptableException('Token is incorrect!');
    if (_email) {
      _email.verified = true;
      await _email.save();
      return true;
    }
    return true;
  }
}
