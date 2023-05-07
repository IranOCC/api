import {
  MinLength,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';

const $ = 'validation.InitialSettingDto';

class _DTO {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.title.IsNotEmpty`) })
  title: string;

  @ApiProperty()
  @MinLength(10, { message: i18nVM(`${$}.description.MinLength`) })
  description: string;

  @ApiProperty()
  @IsArray({ message: i18nVM(`${$}.keywords.IsArray`) })
  keywords: string[];
}

export class InitialSettingDto extends PartialType(_DTO) { }