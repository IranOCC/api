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
import { _$PhoneCountryCode, _$PhoneCountryRegion } from 'src/config/main';
import { UserStatusEum } from '../enum/userStatus.enum';

const $ = 'validation.createUser';

export class CreateUserDto {
  @ApiProperty()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  @IsAlphanumeric('en-US', { message: i18nVM(`${$}.username.IsAlphanumeric`) })
  username: string;

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

  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty({ enum: UserStatusEum })
  @IsEnum(UserStatusEum, { message: i18nVM(`${$}.status.IsEnum`) })
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  roles: string;
}
