import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { Transform } from 'class-transformer';

const $ = 'validation.sendVerifyEmail';

export class SendVerifyEmailDto {
  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: i18nVM(`${$}.email.IsEmail`) })
  email: string;
}
