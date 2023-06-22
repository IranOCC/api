import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PhoneNumberDto } from 'src/phone/dto/phoneNumber.dto';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';

export class PhoneOtpConfirmDto extends PhoneNumberDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM('validation.IsNotEmpty') })
  token: string;
}