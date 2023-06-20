import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PhoneNumber, PhoneNumberSchema } from './schemas/phone.schema';
import { SmsLog, SmsLogSchema } from './schemas/sms_log.schema';

import { UserModule } from 'src/user/user.module';

import { PhoneService } from './phone.service';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNumber.name, schema: PhoneNumberSchema },
    ]),
    MongooseModule.forFeature([
      { name: SmsLog.name, schema: SmsLogSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [PhoneService, SmsService],
  exports: [PhoneService],
  controllers: [SmsController],
})
export class PhoneModule { }
