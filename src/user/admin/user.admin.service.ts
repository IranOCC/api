import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { forwardRef, Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { RoleEnum } from '../enum/role.enum';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { OfficeService } from 'src/office/office.service';
import { ValidationError } from 'class-validator';
import { I18nValidationException, I18nService } from 'nestjs-i18n';
import { useForEnum } from 'src/utils/enum/useFor.enum';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType, } from 'src/utils/helper/listAggregation.helper';
import { UserService } from '../user.service';






@Injectable()
export class UserServiceAdmin {
  constructor(
    private i18n: I18nService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
    private phoneService: PhoneService,
    private emailService: EmailService,
  ) { }


  // Create User
  async create(data: CreateUserDto): Promise<any> {
    const { phone, email, ...props } = data
    const _user = new this.userModel(props)

    if (phone) await this.userService.setPhone(_user, phone)
    if (email) await this.userService.setEmail(_user, email)

    // save
    await _user.save()
    return _user;
  }

  // Edit User
  async update(id: string, data: UpdateUserDto): Promise<any> {
    const { phone, email, ...props } = data
    const _user = await this.userModel.findById(id)

    if (phone) await this.userService.setPhone(_user, phone)
    if (email) await this.userService.setEmail(_user, email)

    // save
    await _user.save()

    return this.userModel.updateOne({ _id: id }, props).exec();
  }

  // List User
  findAll(pagination: PaginationDto, filter: any, sort: any): Promise<User[]> {
    const populate: PopulatedType[] = [
      ["storages", "avatar", "path title alt"],
      ["phonenumbers", "phone", "value verified"],
      ["emailaddresses", "email", "value verified"]
    ]
    const project = "firstName lastName verified active roles"
    const virtualFields = {
      fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
    const searchFields = "fullName"
    return listAggregation(this.userModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get User
  findOne(id: string) {
    return this.userModel.findById(id)
      .populate(['logo', 'path title alt'])
      .populate(['phone', 'value verified'])
      .populate(['email', 'value verified']);
  }

  // Remove Single User
  async remove(id: string) {
    await this.phoneService.removeByUser(id);
    await this.emailService.removeByUser(id);

    await this.userModel.deleteOne({ _id: id })
  }

  // Remove Bulk User
  async bulkRemove(id: string[]) {
    await this.phoneService.removeByBulkUser(id);
    await this.emailService.removeByBulkUser(id);

    await this.userModel.deleteMany({ _id: { $in: id } });
  }




}
