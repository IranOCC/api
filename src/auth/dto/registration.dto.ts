import {
  IsEmail,
  IsAlphanumeric,
  IsStrongPassword,
  IsPhoneNumber,
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../validators/match.decorators';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';

const $ = 'validation.registration';

export class RegistrationDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.firstName.IsNotEmpty`) })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.lastName.IsNotEmpty`) })
  lastName: string;

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
