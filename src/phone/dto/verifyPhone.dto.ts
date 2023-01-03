import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { Transform } from 'class-transformer';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';

const $ = 'validation.verifyPhone';

export class VerifyPhoneDto {
  @ApiProperty()
  @IsString({ message: i18nVM(`${$}.token.IsString`) })
  token: string;

  @ApiProperty()
  @Transform(({ value }) => {
    if (value.length === 10) value = '0' + value;
    return value.replace(/^0/, PHONE_COUNTRY_CODE);
  })
  @IsPhoneNumber(PHONE_COUNTRY_REGION, {
    message: i18nVM(`${$}.phone.IsPhoneNumber`),
  })
  phone: string;
}
