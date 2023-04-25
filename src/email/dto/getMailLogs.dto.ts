import { IsEmail, IsOptional, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';

const $ = 'validation.GetMailLogs';

export class GetMailLogs {
  @ApiProperty()
  @IsOptional()
  @IsEmail({}, { message: i18nVM(`${$}.email.IsEmail`) })
  emailAddress: string;

  @ApiProperty()
  @IsOptional()
  emailID: string;

  @ApiProperty()
  @IsOptional()
  officeID: string;

  @ApiProperty()
  @IsOptional()
  userID: string;
}
