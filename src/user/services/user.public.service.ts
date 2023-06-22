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
export class UserServicePublic {
  constructor(
    private i18n: I18nService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => PhoneService)) private phoneService: PhoneService,
    @Inject(forwardRef(() => EmailService)) private emailService: EmailService,
    @Inject(forwardRef(() => OfficeService)) private officeService: OfficeService,
  ) { }




}
