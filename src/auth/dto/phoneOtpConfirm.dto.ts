import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from 'src/config/main';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';

const $ = 'validation.phoneOtpConfirm';

export class PhoneOtpConfirm {
  @ApiProperty()
  @Transform(({ value }) => {
    if (value.length === 10) value = '0' + value;
    return value.replace(/^0/, PHONE_COUNTRY_CODE);
  })
  @IsPhoneNumber(PHONE_COUNTRY_REGION, {
    message: i18nVM(`${$}.phone.IsPhoneNumber`),
  })
  phone: string;

  @ApiProperty()
  @IsString()
  token: string;
}