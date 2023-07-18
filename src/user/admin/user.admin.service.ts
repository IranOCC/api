import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { CurrentUser, User, UserDocument } from '../schemas/user.schema';
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
  async create(data: CreateUserDto, user: CurrentUser): Promise<any> {
    const { phone, email, ...props } = data

    if (props.roles.includes(RoleEnum.SuperAdmin)) {
      throw new ForbiddenException("You can not add user with SuperAdmin role", "ForbiddenCreateUserHighRole")
    }
    if (props.roles.includes(RoleEnum.Admin)) {
      throw new ForbiddenException("You can not add user with Admin role", "ForbiddenCreateUserHighRole")
    }
    const _user = new this.userModel(props)

    if (phone) await this.userService.setPhone(_user, phone)
    if (email) await this.userService.setEmail(_user, email)

    // save
    await _user.save()
    return _user;
  }

  // Edit User
  async update(id: string, data: UpdateUserDto, user: CurrentUser): Promise<any> {
    const { phone, email, ...props } = data
    const _user = await this.userModel.findById(id)

    if (_user.roles.includes(RoleEnum.SuperAdmin)) {
      throw new ForbiddenException("You can not edit SuperAdmin", "ForbiddenEditUserHighRole")
    }
    if (_user.roles.includes(RoleEnum.Admin)) {
      throw new ForbiddenException("You can not edit Admin", "ForbiddenEditUserHighRole")
    }

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
    const project = "firstName lastName fullName verified active roles createdAt"
    const virtualFields = {
      fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
    const searchFields = "fullName"
    return listAggregation(this.userModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get User
  findOne(id: string) {
    return this.userModel.findById(id)
      .populate('avatar', 'path title alt')
      .populate('phone', 'value verified')
      .populate('email', 'value verified');
  }

  // Remove Single User
  async remove(id: string, user: CurrentUser) {
    const _user = await this.userModel.findById(id)
    if (!_user) throw new NotFoundException("User not found", "UserNotFound")
    if (
      (user.roles.includes(RoleEnum.SuperAdmin))
      ||
      (user.roles.includes(RoleEnum.Admin) && !_user.roles.includes(RoleEnum.SuperAdmin) && !_user.roles.includes(RoleEnum.Admin))
    ) {
      // TODO: delete from office
      await this.phoneService.removeByUser(id);
      await this.emailService.removeByUser(id);
      return await _user.delete()
    }
    throw new ForbiddenException("You can not delete this user", "ForbiddenDeleteUser")
  }

  // Remove Bulk User
  async bulkRemove(id: string[], user: CurrentUser) {
    const _users = await this.userModel.find({ _id: { $in: id } })

    for (let i = 0; i < _users.length; i++) {
      const _user = _users[i];
      if (
        (user.roles.includes(RoleEnum.SuperAdmin))
        ||
        (user.roles.includes(RoleEnum.Admin) && !_user.roles.includes(RoleEnum.SuperAdmin) && !_user.roles.includes(RoleEnum.Admin))
      ) {
        // TODO: remove other
        // TODO: delete from office
        await this.phoneService.removeByUser(_user.id);
        await this.emailService.removeByUser(_user.id);
        await _user.delete()
      }
    }
    return null
  }




}
