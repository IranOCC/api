import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';

const $ = 'validation.GetMailLogs';

export class GetMailLogsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: i18nVM('validation.IsNotEmpty') })
  subject: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ message: i18nVM('validation.IsMongoId') })
  subjectID: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ message: i18nVM('validation.IsMongoId') })
  userID: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ message: i18nVM('validation.IsMongoId') })
  officeID: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ message: i18nVM('validation.IsMongoId') })
  emailID: string;
}
