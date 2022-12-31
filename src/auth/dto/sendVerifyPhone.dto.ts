import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { Transform } from 'class-transformer';
import { _$PhoneCountryCode, _$PhoneCountryRegion } from 'src/config/main';

const $ = 'validation.sendVerifyPhone';

export class SendVerifyPhoneDto {
  @ApiProperty()
  @Transform(({ value }) => {
    if (value.length === 10) value = '0' + value;
    return value.replace(/^0/, _$PhoneCountryCode);
  })
  @IsPhoneNumber(_$PhoneCountryRegion, {
    message: i18nVM(`${$}.phone.IsPhoneNumber`),
  })
  phone: string;
}
