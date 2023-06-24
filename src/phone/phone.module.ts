import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PhoneNumber, PhoneNumberSchema } from './schemas/phone.schema';
import { SmsLog, SmsLogSchema } from './schemas/sms_log.schema';

import { PhoneService } from './phone.service';
import { SmsService } from './sms/sms.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNumber.name, schema: PhoneNumberSchema },
    ]),
    MongooseModule.forFeature([
      { name: SmsLog.name, schema: SmsLogSchema },
    ]),
  ],
  providers: [PhoneService, SmsService],
  controllers: [],
  exports: [PhoneService],

})
export class PhoneModule { }
