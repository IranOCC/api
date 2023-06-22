import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { PhoneModule } from '../phone/phone.module';
import { User, UserSchema } from './schemas/user.schema';
import { OfficeModule } from 'src/office/office.module';
import { UserControllerAdmin } from './controllers/user.admin.controller';
import { UserControllerPublic } from './controllers/user.public.controller';
import { UserControllerTools } from './controllers/user.tools.controller';
import { UserServiceTools } from './services/user.tools.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => PhoneModule),
    forwardRef(() => EmailModule),
    forwardRef(() => OfficeModule),
  ],
  controllers: [UserControllerAdmin, UserControllerPublic, UserControllerTools],
  providers: [UserService, UserServiceTools],
  exports: [UserService],
})
export class UserModule { }
