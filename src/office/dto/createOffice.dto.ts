import {
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  MinLength,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';

const $ = 'validation.CreateOfficeDto';

export class CreateOfficeDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.name.IsNotEmpty`) })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(10, { message: i18nVM(`${$}.description.MinLength`) })
  description: string;

  @ApiProperty()
  @IsMongoId({ message: i18nVM(`${$}.management.IsMongoId`) })
  management: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ message: i18nVM(`${$}.logo.IsMongoId`), })
  logo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: i18nVM(`${$}.email.IsEmail`) })
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value.length === 10) value = '0' + value;
    return value.replace(/^0/, PHONE_COUNTRY_CODE);
  })
  @IsPhoneNumber(PHONE_COUNTRY_REGION, {
    message: i18nVM(`${$}.phone.IsPhoneNumber`),
  })
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  province: string;

  @ApiPropertyOptional()
  @IsOptional()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  location: [number, number];

  @ApiPropertyOptional()
  @IsOptional()
  verified: boolean;
}
