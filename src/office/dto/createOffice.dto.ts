import {
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  MinLength,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';

const $ = 'validation.createOffice';

export class CreateOfficeDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.name.IsNotEmpty`) })
  name: string;

  @ApiProperty()
  @MinLength(10, { message: i18nVM(`${$}.description.MinLength`) })
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsMongoId({ message: i18nVM(`${$}.management.IsMongoId`) })
  management: string;

  @ApiProperty()
  @IsMongoId({ message: i18nVM(`${$}.logo.IsMongoId`) })
  @IsOptional()
  logo: string;

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
  @IsOptional()
  province: string;

  @ApiProperty()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  location: [number, number];

  @ApiProperty()
  @IsOptional()
  verified: boolean;
}
