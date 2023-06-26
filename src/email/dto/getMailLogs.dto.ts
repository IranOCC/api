import { IsEnum, IsMongoId, IsOptional, ValidateIf, } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';


export class GetMailLogsDto {
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
  email: string;
}
