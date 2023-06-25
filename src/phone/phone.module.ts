import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PhoneNumber, PhoneNumberSchema } from './schemas/phone.schema';
import { SmsLog, SmsLogSchema } from './schemas/sms_log.schema';

import { PhoneService } from './phone.service';
import { SmsService } from './sms/sms.service';
import { SmsTemplate, SmsTemplateSchema } from './schemas/sms_template.schema';
import { SmsTemplateControllerAdmin } from './sms_template/admin/sms_template.admin.controller';
import { SmsTemplateServiceAdmin } from './sms_template/admin/sms_template.admin.service';
import { SmsTemplateServiceTools } from './sms_template/tools/sms_template.tools.service';
import { SmsTemplateControllerTools } from './sms_template/tools/sms_template.tools.controller';
import { SmsLogService } from './sms_log/sms_log.service';
import { SmsTemplateService } from './sms_template/sms_template.service';


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
  providers: [PhoneService, SmsService, SmsLogService, SmsTemplateService, SmsTemplateServiceAdmin, SmsTemplateServiceTools],
  controllers: [SmsTemplateControllerAdmin, SmsTemplateControllerTools],
  exports: [PhoneService],
})
export class PhoneModule { }


