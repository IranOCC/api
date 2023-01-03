import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';
import { Match } from '../../validators/match.decorators';
import { PasswordResetMethods } from '../enum/passwordResetMethod.enum';
const $ = 'validation.passwordResetConfirm';

export class PasswordResetConfirmDto {
  @ApiProperty({ enum: PasswordResetMethods })
  @IsEnum(PasswordResetMethods, { message: i18nVM(`${$}.method.IsEnum`) })
  method: string;

  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: i18nVM(`${$}.email.IsEmail`) })
  @IsOptional()
  email: string;

  @ApiProperty()
  @Transform(({ value }) => {
    if (value.length === 10) value = '0' + value;
    return value.replace(/^0/, PHONE_COUNTRY_CODE);
  })
  @IsPhoneNumber(PHONE_COUNTRY_REGION, {
    message: i18nVM(`${$}.phone.IsPhoneNumber`),
  })
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString({ message: i18nVM(`${$}.token.IsString`) })
  token: string;

  @ApiProperty()
  @IsStrongPassword({}, { message: i18nVM(`${$}.password.IsStrongPassword`) })
  password: string;

  @ApiProperty()
  @Match('password', { message: i18nVM(`${$}.confirmPassword.Match`) })
  confirmPassword: string;
}
