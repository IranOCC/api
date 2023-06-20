import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailAddress, EmailAddressSchema } from './email/schemas/email.schema';
import { EmailController } from './email/email.controller';
import { UserModule } from 'src/user/user.module';
import { EmailService } from './email/email.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailAddress.name, schema: EmailAddressSchema },
    ]),
    forwardRef(() => UserModule),
    MailModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule { }
