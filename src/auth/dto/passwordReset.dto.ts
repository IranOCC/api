import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
import { _$PhoneCountryCode, _$PhoneCountryRegion } from 'src/config/main';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PasswordResetMethods } from '../enum/passwordResetMethod.enum';
const $ = 'validation.passwordReset';

export class PasswordResetDto {
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
    return value.replace(/^0/, _$PhoneCountryCode);
  })
  @IsPhoneNumber(_$PhoneCountryRegion, {
    message: i18nVM(`${$}.phone.IsPhoneNumber`),
  })
  @IsOptional()
  phone: string;
}
