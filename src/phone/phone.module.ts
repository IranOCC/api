import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PhoneNumber, PhoneNumberSchema } from './schemas/phone.schema';
import { SmsLog, SmsLogSchema } from './schemas/sms_log.schema';

import { PhoneService } from './phone.service';
import { SmsService } from './sms/sms.service';
import { SmsTemplateController } from './sms_template/admin/sms_template.controller';
import { SmsTemplate, SmsTemplateSchema } from './schemas/sms_template.schema';
import { SmsTemplateService } from './sms_template/admin/sms_template.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNumber.name, schema: PhoneNumberSchema },
    ]),
    MongooseModule.forFeature([
      { name: SmsLog.name, schema: SmsLogSchema },
    ]),
    MongooseModule.forFeature([
      { name: SmsTemplate.name, schema: SmsTemplateSchema },
    ]),
  ],
  providers: [PhoneService, SmsService, SmsTemplateService],
  controllers: [SmsTemplateController],
  exports: [PhoneService],

})
export class PhoneModule { }


