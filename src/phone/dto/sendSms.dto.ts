import { IsEnum, IsMongoId, IsObject, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';


export class SendSmsDto {
  @ApiProperty()
  @IsMongoId()
  template: string;

  @ApiProperty({ default: {} })
  @IsObject()
  context: any;

  @ApiPropertyOptional({ enum: RelatedToEnum })
  @IsOptional()
  @IsEnum(RelatedToEnum)
  relatedTo: RelatedToEnum = null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  relatedToID: string;

  @ApiProperty()
  @IsMongoId()
  phone: string;
}
