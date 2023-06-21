import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PhoneNumber, PhoneNumberSchema } from './schemas/phone.schema';
import { SmsLog, SmsLogSchema } from './schemas/sms_log.schema';

import { UserModule } from 'src/user/user.module';

import { PhoneService } from './phone.service';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { OfficeModule } from 'src/office/office.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNumber.name, schema: PhoneNumberSchema },
    ]),
    MongooseModule.forFeature([
      { name: SmsLog.name, schema: SmsLogSchema },
    ]),
    forwardRef(() => OfficeModule),
    forwardRef(() => UserModule),
  ],
  providers: [PhoneService, SmsService],
  controllers: [SmsController],
  exports: [PhoneService],

})
export class PhoneModule { }
