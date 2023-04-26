import {
  IsEmail,
  IsAlphanumeric,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';
import { UserStatusEum } from '../enum/userStatus.enum';

const $ = 'validation.createUser';

export class CreateUserDto {
  @ApiProperty()
  @IsOptional()
  firstName: string | null | undefined;

  @ApiProperty()
  @IsOptional()
  lastName: string | null | undefined;

  // @ApiProperty()
  // @Transform(({ value }) => value.toLowerCase())
  // @IsEmail({}, { message: i18nVM(`${$}.email.IsEmail`) })
  // @IsOptional()
  // email: string | null | undefined;

  // @ApiProperty()
  // @Transform(({ value }) => {
  //   if (value.length === 10) value = '0' + value;
  //   return value.replace(/^0/, PHONE_COUNTRY_CODE);
  // })
  // @IsPhoneNumber(PHONE_COUNTRY_REGION, {
  //   message: i18nVM(`${$}.phone.IsPhoneNumber`),
  // })
  // @IsOptional()
  // phone: string;

  @ApiProperty()
  @IsOptional()
  password: string | null | undefined;

  @ApiProperty()
  @IsOptional()
  avatar: string | null | undefined;

  @ApiProperty({ enum: UserStatusEum })
  @IsEnum(UserStatusEum, { message: i18nVM(`${$}.status.IsEnum`) })
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  roles: string[] | null | undefined;
}
