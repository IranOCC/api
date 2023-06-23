import { BadRequestException, forwardRef, Inject, Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationError } from 'class-validator';
import { Model } from 'mongoose';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { PhoneService } from 'src/phone/phone.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { useForEnum } from 'src/utils/enum/useFor.enum';
import { CreateOfficeDto } from './dto/createOffice.dto';
import { UpdateOfficeDto } from './dto/updateOffice.dto';
import { MemberService } from './member.service';
import { Office, OfficeDocument } from './schemas/office.schema';




@Injectable()
export class OfficeService {
  constructor(
    private i18n: I18nService,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
    @Inject(forwardRef(() => PhoneService)) private phoneService: PhoneService,
    @Inject(forwardRef(() => EmailService)) private emailService: EmailService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private memberService: MemberService,
  ) { }

  // =============================> Admin Crud <===========================
  // *
  async create(data: CreateOfficeDto): Promise<Office> {
    const { phone, email, management, ...modelData } = data
    const _office: Office = new this.officeModel(modelData)
    // 

    if (phone) await this.setPhone(_office, phone)
    if (email) await this.setEmail(_office, email)
    if (management) await this.setManagement(_office, management)

    // save
    await _office.save()
    return _office;
  }

  // *
  async update(id: string, data: UpdateOfficeDto): Promise<any> {
    const { phone, email, management, ...modelData } = data

    const _office: Office = await this.officeModel.findById(id)
    // 
    if (phone) await this.setPhone(_office, phone)
    if (email) await this.setEmail(_office, email)
    if (management) await this.setManagement(_office, management)

    // save
    return this.officeModel.updateOne({ _id: id }, modelData).exec();
  }

  findAll(): Promise<Office[]> {
    return this.officeModel.find().populate(['members']).exec();
  }

  findOne(id: string, ...arg) {
    return this.officeModel.findById(id, ...arg);
  }

  // 
  getOfficeForMailService = (id: string) => {
    return this.findOne(id, {}, { autopopulate: false })
      .populate({
        path: "email",
        select: "value verified office",
        populate: { path: "office", select: "-phone" }
      })
  }
  getOfficeForSmsService = (id: string) => {
    return this.findOne(id, {}, { autopopulate: false })
      .populate({
        path: "phone",
        select: "value verified office",
        populate: { path: "office", select: "-email" }
      })
  }





  async remove(id: string) {
    const o = await this.findOne(id)
    if (o.phone) this.phoneService.remove(o.phone?._id);
    if (o.email) this.emailService.remove(o.email?._id);
    await o.remove();
  }

  // ====================> tools <====================
  async getOrCheck(data: Office | string): Promise<Office> {
    let _data: Office
    if (typeof data === 'string')
      _data = await this.findOne(data)
    else
      _data = data

    return _data
  }

  // ======> phone
  async setPhone(office: Office, phone: PhoneDto) {
    try {
      const phoneID = await this.phoneService.setup(phone.value, useForEnum.Office, office, phone.verified)
      office.phone = phoneID
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
  // ======> email
  async setEmail(office: Office, email: EmailDto) {
    try {
      const emailID = await this.emailService.setup(email.value, useForEnum.Office, office, email.verified)
      office.email = emailID
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


  // ======> management
  async setManagement(office: Office, management: User | string) {

    // is admin?
    // const u = await this.userService.hasAdminRole(management)
    // if (!u) {
    //   throw new BadRequestException({
    //     errors: {
    //       "management": { "MustBeAdmin": "کاربر نیاز است حداقل دسترسی ادمین را دارا باشد" }
    //     }
    //   })
    // }
    // if (!((u as User).active)) {
    //   throw new BadRequestException({
    //     errors: {
    //       "management": { "NotActive": "کاربر غیرفعال است" }
    //     }
    //   })
    // }

    // add member
    await this.memberService.add(office, management)

    // set admin
    office.management = management
  }




  async assignList(search: string = "") {
    return (await this.officeModel
      .find(
        {
          name: { $regex: search }
        },
        { phone: 0, email: 0, logo: 0, }
      )
      .limit(20)
    ).map((doc) => ({ title: doc.name, value: doc._id }))
  }
}
