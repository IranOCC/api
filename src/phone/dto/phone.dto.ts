import {
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { Transform, } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';


const $ = 'validation.PhoneDto';

export class PhoneDto {
  @ApiProperty()
  @Transform(({ value }) => {
    if (value.length === 10) value = '0' + value;
    return value.replace(/^0/, PHONE_COUNTRY_CODE);
  })
  @IsPhoneNumber(PHONE_COUNTRY_REGION)
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  verified: boolean;
}
