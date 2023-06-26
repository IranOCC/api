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
import { PaginationDto } from 'src/utils/dto/pagination.dto';






@Injectable()
export class UserServiceAdmin {
  constructor(
    private i18n: I18nService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private phoneService: PhoneService,
    private emailService: EmailService,
  ) { }

  // *
  async create(data: CreateUserDto): Promise<any> {
    const { phone, email, ...modelData } = data
    const _user = new this.userModel(modelData)

    if (phone) await this.setPhone(_user, phone)
    if (email) await this.setEmail(_user, email)

    // save
    await _user.save()
    return _user;
  }

  // *
  async update(id: string, data: UpdateUserDto): Promise<any> {
    const { phone, email, ...modelData } = data
    const _user = await this.userModel.findById(id)

    if (phone) await this.setPhone(_user, phone)
    if (email) await this.setEmail(_user, email)

    return this.userModel.updateOne({ _id: id }, modelData).exec();
  }

  findAll({ current, size, search, filter }: PaginationDto): Promise<User[]> {



    const _search = ['fullName']
    const _filter = []




    return this.userModel.aggregate([
      {
        $lookup: {
          from: "phonenumbers",
          as: "phone",
          localField: "phone",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                value: true,
                verified: true
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "emailaddresses",
          as: "email",
          localField: "email",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                value: true,
                verified: true
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "storage",
          as: "avatar",
          localField: "avatar",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                value: true,
                verified: true
              }
            }
          ]
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          phone: { $first: "$phone" },
          email: { $first: "$email" },
          avatar: { $first: "$avatar" },
          verified: 1,
          active: 1,
          roles: 1,
        }
      },

      {
        $addFields: {
          fullName: { $concat: ["$firstName", " ", "$lastName"] }
        }
      },
      {
        $match: {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            // { _id: new mongoose.Types.ObjectId(initial) }
          ]
        }
      },
      // {
      //   $project: {
      //     _id: 0,
      //     title: "$fullName",
      //     value: "$_id",
      //     isInitial: {
      //       $cond: [
      //         // { $eq: ["$_id", new mongoose.Types.ObjectId(initial)] },
      //         1,
      //         0
      //       ]
      //     }
      //   }
      // },
      { $skip: (current - 1) * size },
      { $limit: size },
      { $sort: { createdAt: -1 } },

    ]).exec()










    const myCustomLabels = {
      totalDocs: 'count',
      docs: 'items',
      limit: 'size',
      page: 'current',
      nextPage: 'next',
      prevPage: 'prev',
      totalPages: 'pageCount',
      pagingCounter: 'slNo',
      meta: 'paginator',
    };
    const searchPath = [
      'fullName',

    ]
    const query = { firstName: { $regex: search, $options: "i" } };
    const options = {
      select: 'firstName lastName verified active roles',
      sort: 'createdAt',
      projection: {
        full_Name: { $concat: ["$firstName", " ", "$lastName"] }
      },
      populate: [
        {
          path: "phone",
          select: "value verified",
        },
        {
          path: "email",
          select: "value verified",
        },
        {
          path: "avatar"
        }
      ],
      lean: true,
      page: current,
      limit: size,
      customLabels: myCustomLabels,
    };

    // @ts-ignore
    return this.userModel.paginate(query, options)
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).populate(['phone']);
  }

  async remove(id: string) {
    // const o = await this.findOne(id)
    // if (o.phone) this.phoneService.remove(o.phone?._id);
    // if (o.email) this.emailService.remove(o.email?._id);
    // await o.remove();
  }


  bulkRemove(id: string[]) {
    return this.userModel.deleteMany({ _id: { $in: id } });
  }


  // ======> phone
  async setPhone(user: User, phone: PhoneDto) {
    try {
      const phoneID = await this.phoneService.setup(phone.value, useForEnum.User, user, phone.verified)
      user.phone = phoneID
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
  async setEmail(user: User, email: EmailDto) {
    try {
      const emailID = await this.emailService.setup(email.value, useForEnum.User, user, email.verified)
      user.email = emailID
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


  // ==>
  async getOrCheck(data: User | string): Promise<User> {
    let _data: User
    if (typeof data === 'string')
      _data = await this.findOne(data)
    else
      _data = data

    return _data
  }


  async hasSuperAdminRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.SuperAdmin) && _user
  }

  async hasAdminRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.Admin) && _user
  }

  async hasAgentRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.Agent) && _user
  }

  async hasAuthorRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.Author) && _user
  }

  async hasUserRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.User) && _user
  }

}
