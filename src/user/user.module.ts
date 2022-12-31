import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { EmailAddress, EmailAddressSchema } from './schemas/email.schema';
import { PhoneNumber, PhoneNumberSchema } from './schemas/phone.schema';
import { EmailService } from './services/email.service';
import { PhoneService } from './services/phone.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmailAddress.name, schema: EmailAddressSchema },
      { name: PhoneNumber.name, schema: PhoneNumberSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, PhoneService, EmailService],
  exports: [UserService, PhoneService, EmailService],
})
export class UserModule {}
