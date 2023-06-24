import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { PhoneModule } from '../phone/phone.module';
import { User, UserSchema } from './schemas/user.schema';
import { OfficeModule } from 'src/office/office.module';
import { UserControllerAdmin } from './admin/user.admin.controller';
import { UserControllerPublic } from './public/user.public.controller';
import { UserControllerTools } from './tools/user.tools.controller';
import { UserServiceTools } from './tools/user.tools.service';
import { UserServiceAdmin } from './admin/user.admin.service';
import { UserServicePublic } from './public/user.public.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PhoneModule,
    EmailModule,
    forwardRef(() => OfficeModule),
  ],
  controllers: [UserControllerAdmin, UserControllerPublic, UserControllerTools],
  providers: [UserService, UserServiceAdmin, UserServicePublic, UserServiceTools],
  exports: [UserService],
})
export class UserModule { }
