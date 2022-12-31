import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { Transform } from 'class-transformer';

const $ = 'validation.verifyEmail';

export class VerifyEmailDto {
  @ApiProperty()
  @IsString({ message: i18nVM(`${$}.token.IsString`) })
  token: string;

  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: i18nVM(`${$}.email.IsEmail`) })
  email: string;
}
