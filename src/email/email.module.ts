import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { EmailService } from './email.service';
import { EmailAddress, EmailAddressSchema } from './schemas/email.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailAddress.name, schema: EmailAddressSchema },
    ]),
    MailModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
