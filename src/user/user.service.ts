import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { PhoneOtpDto } from 'src/auth/dto/phoneOtp.dto';
import { RoleEnum } from './enum/role.enum';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { EmailOtpDto } from 'src/auth/dto/emailOtp.dto';
import { ValidationError } from 'class-validator';
import { I18nValidationException, I18nService } from 'nestjs-i18n';
import { useForEnum } from 'src/utils/enum/useFor.enum';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { EmailAddress } from 'src/email/schemas/email.schema';






@Injectable()
export class UserService {
    constructor(
        private i18n: I18nService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private phoneService: PhoneService,
        private emailService: EmailService,
    ) { }



    // ===========================================> (AuthService) <===============================================



    // ==============================================================================> login by phone 

    // Find or Create By Phone
    async findOrCreateByPhone({ phone }: PhoneOtpDto) {
        let user: User
        try {
            // ===> get user
            // get phone
            const phoneQ = await this.phoneService.find(phone)
            // get user
            user = await this.getUserForLogin((phoneQ.user as string))
        } catch (error) {
            // ===> create user
            // create user instance
            const newUser = { active: true, roles: [RoleEnum.User] }
            user = new this.userModel(newUser)
            try {
                // setup Phone
                user.phone = await this.phoneService.setup(phone, useForEnum.User, user)
                await user.save()
            } catch (error) {
                // throw exception
                const _error = new ValidationError();
                _error.property = 'phone';
                _error.constraints = {
                    PhoneNumberInUsed: this.i18n.t("exception.PhoneNumberInUsed")
                };
                _error.value = phone;
                throw new I18nValidationException([_error])
            }
        }
        return user
    }

    // Send Phone Otp Code
    async sendPhoneOtpCode(user: User) {
        return await this.phoneService.sendOtpCode((user.phone as PhoneNumber).value)
    }

    // Confirm Phone Otp Code
    async confirmPhoneOtpCode(user: User, token: string) {
        const isValid = await this.phoneService.confirmOtpCode({ phone: (user.phone as PhoneNumber).value, token })
        if (!isValid) throw new UnauthorizedException("Otp token is wrong", "TokenWrong")
    }

    // ==============================================================================> login by phone 




    // ==============================================================================> login by email 

    // Find or Create By Email
    async findOrCreateByEmail({ email }: EmailOtpDto): Promise<User> {
        let user: User
        try {
            // ===> get user
            // get email
            const emailQ = await this.emailService.find(email)
            // get user
            user = await this.getUserForLogin((emailQ.user as string))
        } catch (error) {
            // ===> create user
            // create user instance
            const newUser = { active: true, roles: [RoleEnum.User] }
            user = new this.userModel(newUser)
            try {
                // setup Email
                user.email = await this.emailService.setup(email, useForEnum.User, user)
                await user.save()
            } catch (error) {
                // throw exception
                const _error = new ValidationError();
                _error.property = 'email';
                _error.constraints = {
                    EmailAddressInUsed: this.i18n.t("exception.EmailAddressInUsed")
                };
                _error.value = email;
                throw new I18nValidationException([_error])
            }
        }
        return user
    }

    // Send Email Otp Code
    async sendEmailOtpCode(user: User) {
        return await this.emailService.sendOtpCode((user.email as EmailAddress).value)
    }



    // Confirm Email Otp Code
    async confirmEmailOtpCode(user: User, token: string) {
        const isValid = await this.emailService.confirmOtpCode({ email: (user.email as EmailAddress).value, token })
        if (!isValid) throw new UnauthorizedException("Otp token is wrong", "TokenWrong")
    }

    // ==============================================================================> login by email



    // ==============================================================================> get ME & payload

    // Check User For Login
    async getUserForLogin(id: string) {
        const user = await this.userModel
            .findById(id)
            .select("_id roles firstName lastName fullName verified active phone email avatar")
            .exec()
        if (!user) throw 'NotFound'

        return user
    }


    // Get User Payload & get ME
    async getUserPayload(id: string) {
        const user = await this.userModel
            .findById(id)
            .select("_id roles firstName lastName fullName verified active phone email avatar accountToken province city address location")
            .exec()
        if (!user) throw new UnauthorizedException("User not found", "UserNotFound")
        if (!user?.active) throw new UnauthorizedException("Your account is inactive by management", "UserLoginInactive")

        return user
    }


    // ==============================================================================> get ME & payload






    // ===========================================> (AuthService) <===============================================







    // ======================================================




    // find by ID
    findOne(id: string, ...arg) {
        return this.userModel.findById(id, ...arg);
    }


    // 
    getUserForMailService = (id: string) => {
        return this.findOne(id, {}, { autopopulate: false })
            .populate({
                path: "email",
                select: "value verified user",
                populate: { path: "user", select: "-phone" }
            })
    }
    getUserForSmsService = (id: string) => {
        return this.findOne(id, {}, { autopopulate: false })
            .populate({
                path: "phone",
                select: "value verified user",
                populate: { path: "user", select: "-email" }
            })
    }



}
