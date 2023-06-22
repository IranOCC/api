import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { PhoneOtpDtoDto } from 'src/auth/dto/phoneOtp.dto';
import { RoleEnum } from '../enum/role.enum';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { OfficeService } from 'src/office/office.service';
import { EmailOtpDto } from 'src/auth/dto/emailOtp.dto';
import { ValidationError } from 'class-validator';
import { I18nValidationException, I18nService } from 'nestjs-i18n';
import { useForEnum } from 'src/utils/enum/useFor.enum';






@Injectable()
export class UserService {
  constructor(
    private i18n: I18nService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => PhoneService)) private phoneService: PhoneService,
    @Inject(forwardRef(() => EmailService)) private emailService: EmailService,
    @Inject(forwardRef(() => OfficeService)) private officeService: OfficeService,
  ) { }


  // *
  async findOrCreateByPhone({ phone }: PhoneOtpDtoDto): Promise<User> {
    let user: User
    try {
      const phoneQ = await this.phoneService.find(phone, useForEnum.User)
      user = await this.userModel.findById(phoneQ.user).select(["_id", "roles", "firstName", "lastName", "fullName", "avatar"])
      if (!user) throw 'Not found'
      return user
    } catch (error) {
      const userData = { active: true, roles: [RoleEnum.User] } as CreateUserDto
      user = new this.userModel(userData)
      try {
        const phoneID = await this.phoneService.setup(phone, useForEnum.User, user)
        user.phone = phoneID
        await user.save()
        return user
      } catch (error) {
        const _error = new ValidationError();
        _error.property = 'phone';
        _error.constraints = {
          PhoneNumberInUsed: this.i18n.t("exception.PhoneNumberInUsed")
        };
        _error.value = phone;
        throw new I18nValidationException([_error])
      }
    }
  }

  // *
  async sendPhoneOtpCode(user: User) {
    return await this.phoneService.sendOtpCode(user.phone.value)
  }

  // *
  async confirmPhoneOtpCode(user: User, token: string) {
    const isValid = await this.phoneService.confirmOtpCode({ phone: user.phone.value, token })
    if (!isValid) {
      throw new UnauthorizedException("Otp token is wrong", "TokenWrong")
    }
  }


  // *********************

  // *
  async findOrCreateByEmail({ email }: EmailOtpDto): Promise<User> {
    let user: User
    try {
      const emailQ = await this.emailService.find(email, useForEnum.User)
      user = await this.userModel.findById(emailQ.user).select(["_id", "roles", "firstName", "lastName", "fullName", "avatar"])
      if (!user) throw 'Not found'
      return user
    } catch (error) {
      const userData = { active: true, roles: [RoleEnum.User] } as CreateUserDto
      user = new this.userModel(userData)
      try {
        const emailID = await this.emailService.setup(email, useForEnum.User, user)
        user.email = emailID
        await user.save()
        return user
      } catch (error) {
        const _error = new ValidationError();
        _error.property = 'email';
        _error.constraints = {
          EmailAddressInUsed: this.i18n.t("exception.EmailAddressInUsed")
        };
        _error.value = email;
        throw new I18nValidationException([_error])
      }
    }
  }

  // *
  async sendEmailOtpCode(user: User) {
    return await this.emailService.sendOtpCode(user.email.value)
  }

  // *
  async confirmEmailOtpCode(user: User, token: string) {
    const isValid = await this.emailService.confirmOtpCode({ email: user.email.value, token })
    if (!isValid) {
      throw new UnauthorizedException("Otp token is wrong", "TokenWrong")
    }
  }



  // ===============================


  // *
  async getUserPayload(id: string) {
    return await this.userModel.findById(id)
      .select(["_id", "roles", "firstName", "lastName", "fullName", "avatar", "accountToken", "verified", "active", "province", "city", "address", "location"])
      .populate("phone", ["value", "verified"])
      .populate("email", ["value", "verified"])
  }



}
