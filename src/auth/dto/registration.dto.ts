import {
  IsEmail,
  IsAlpha,
  IsAlphanumeric,
  IsStrongPassword,
  IsPhoneNumber,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../validators/match.decorators';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import {
  NAME_LANG_INPUT,
  PHONE_COUNTRY_CODE,
  PHONE_COUNTRY_REGION,
} from '../../config/main';

const $ = 'validation.registration';

export class RegistrationDto {
  @ApiProperty()
  @IsAlpha(NAME_LANG_INPUT, { message: i18nVM(`${$}.firstName.IsAlpha`) })
  @MinLength(3, { message: i18nVM(`${$}.firstName.MinLength`) })
  @MaxLength(35, { message: i18nVM(`${$}.firstName.MaxLength`) })
  firstName: string;

  @ApiProperty()
  @IsAlpha(NAME_LANG_INPUT, { message: i18nVM(`${$}.lastName.IsAlpha`) })
  @MinLength(3, { message: i18nVM(`${$}.lastName.MinLength`) })
  @MaxLength(35, { message: i18nVM(`${$}.lastName.MaxLength`) })
  lastName: string;

  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  @IsAlphanumeric('en-US', { message: i18nVM(`${$}.username.IsAlphanumeric`) })
  @MinLength(3, { message: i18nVM(`${$}.username.MinLength`) })
  @MaxLength(35, { message: i18nVM(`${$}.lastName.MaxLength`) })
  username: string;

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
  @IsStrongPassword({}, { message: i18nVM(`${$}.password.IsStrongPassword`) })
  password: string;

  @ApiProperty()
  @Match('password', { message: i18nVM(`${$}.confirmPassword.Match`) })
  confirmPassword: string;
}
