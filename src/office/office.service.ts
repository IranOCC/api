import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { useForEnum } from 'src/auth/enum/useFor.enum';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { PhoneService } from 'src/phone/phone.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { CreateOfficeDto } from './dto/createOffice.dto';
import { UpdateOfficeDto } from './dto/updateOffice.dto';
import { MemberService } from './member/member.service';
import { Office, OfficeDocument } from './schemas/office.schema';

@Injectable()
export class OfficeService {
  constructor(
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
    private phoneService: PhoneService,
    private emailService: EmailService,
    private userService: UserService,
    private memberService: MemberService,
  ) { }

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
    return this.officeModel.find().exec();
  }

  findOne(id: string) {
    return this.officeModel.findById(id);
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
      throw new BadRequestException({
        errors: [
          {
            property: "phone.value",
            constraints: { "IsAlreadyExists": "این شماره قبلا ثبت شده است" }
          }
        ]
      })
    }
  }
  // ======> email
  async setEmail(office: Office, email: EmailDto) {
    try {
      const emailID = await this.emailService.setup(email.value, useForEnum.Office, office, email.verified)
      office.email = emailID
    } catch (error) {
      throw new BadRequestException({
        errors: [
          {
            property: "email.value",
            constraints: { "IsAlreadyExists": "این ایمیل قبلا ثبت شده است" }
          }
        ]
      })
    }
  }

  // ======> management
  async setManagement(office: Office, management: User | string) {

    // is admin?
    const u = await this.userService.hasAdminRole(management)
    if (!u) {
      throw new BadRequestException({
        errors: [
          {
            property: "management",
            constraints: { "MustBeAdmin": "کاربر نیاز است حداقل دسترسی ادمین را دارا باشد" }
          }
        ]
      })
    }
    if (!((u as User).active)) {
      throw new BadRequestException({
        errors: [
          {
            property: "management",
            constraints: { "NotActive": "کاربر غیرفعال است" }
          }
        ]
      })
    }

    // add member
    await this.memberService.add(office, management)

    // set admin
    office.management = management
  }







}
