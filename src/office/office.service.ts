import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, } from '@nestjs/common';
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
import { OfficeMemberAdminService } from './members/admin/member.admin.service';
import { Office, OfficeDocument } from './schemas/office.schema';
import { ObjectId } from 'mongodb';
import { RoleEnum } from 'src/user/enum/role.enum';




@Injectable()
export class OfficeService {
  constructor(
    private i18n: I18nService,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
    private memberService: OfficeMemberAdminService,
    private userService: UserService,
    private phoneService: PhoneService,
    private emailService: EmailService,
  ) { }



  // ======> management
  async setManagement(office: Office, management: string) {

    // checking user
    const canBeAdmin = await this.userService.hasAdminRole(management)

    // is Admin?
    if (!canBeAdmin) {
      const _error = new ValidationError();
      _error.property = 'management';
      _error.constraints = {
        AdminRoleNeeded: this.i18n.t("exception.AdminRoleNeeded")
      };
      _error.value = management;
      throw new I18nValidationException([_error])
    }

    // is Active?
    if (!((canBeAdmin as User).active)) {
      const _error = new ValidationError();
      _error.property = 'management';
      _error.constraints = {
        UserInactive: this.i18n.t("exception.UserInactive")
      };
      _error.value = management;
      throw new I18nValidationException([_error])
    }

    // so add to members
    this.memberService.add(office, management)

    // then set admin
    office.management = management
  }




  // ===========================================> (Self) <===============================================

  // ======> phone
  async setPhone(office: Office, phone: PhoneDto) {
    try {
      const phoneID = await this.phoneService.setup(phone.value, useForEnum.Office, office, phone.verified)
      office.phone = phoneID
      // await office.save()
    } catch (error) {
      const _error = new ValidationError();
      _error.property = 'phone.value';
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
      // await office.save()
    } catch (error) {
      const _error = new ValidationError();
      _error.property = 'email.value';
      _error.constraints = {
        EmailAddressInUsed: this.i18n.t("exception.EmailAddressInUsed")
      };
      _error.value = email;
      throw new I18nValidationException([_error])
    }
  }






  // ==========================> get my offices
  async getMyOffices(user: User) {
    if (user.roles.includes(RoleEnum.SuperAdmin)) return this.officeModel.find().select("_id name active verified")
    return this.officeModel.find({ members: new ObjectId(user._id) }).select("_id name active verified")
  }


  // get office
  async checkOffice(office_id: string) {
    const o = await this.officeModel.findById(office_id)
    if (!o) throw new NotFoundException("Office not found", "OfficeNotFound")
    return o
  }


  // is member of office?
  async isMember(office_id: string, user_id: string) {
    return this.officeModel.find({ _id: new ObjectId(office_id), members: new ObjectId(user_id) })
  }

  // is management of office?
  async isManagement(office_id: string, user_id: string) {
    return this.officeModel.find({ _id: new ObjectId(office_id), management: new ObjectId(user_id) })
  }


}
