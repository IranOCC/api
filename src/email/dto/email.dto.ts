import {
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  MinLength,
  IsNotEmpty,
  IsMongoId,
  IsInstance,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Storage } from "src/storage/schemas/storage.schema"
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';


const $ = 'validation.EmailDto';

export class EmailDto {
  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  verified: boolean;
}
