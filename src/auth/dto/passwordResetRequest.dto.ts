import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PasswordResetMethods } from '../enum/passwordResetMethod.enum';
const $ = 'validation.passwordResetRequest';

export class PasswordResetRequestDto {
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
}
