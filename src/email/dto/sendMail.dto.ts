import { IsMongoId, IsNotEmpty, IsOptional, } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';



export class SendMailDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM('validation.IsNotEmpty') })
  text: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nVM('validation.IsNotEmpty') })
  subject: string;

  @ApiProperty()
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
