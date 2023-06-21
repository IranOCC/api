import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { EmailAddressDto } from 'src/email/dto/emailAddress.dto';

export class EmailOtpConfirmRequestDto extends EmailAddressDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM('validation.IsNotEmpty') })
  token: string;
}
