import { IsEnum, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';

export class GetSmsLogsDto {
  @ApiPropertyOptional({ enum: RelatedToEnum })
  @IsOptional()
  @IsEnum(RelatedToEnum)
  relatedTo: RelatedToEnum = null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  relatedToID: string;

  @ApiPropertyOptional()
  @ValidateIf((obj, val) => (!val && !obj.office && !obj.phone))
  @IsMongoId()
  user: string;

  @ApiPropertyOptional()
  @ValidateIf((obj, val) => (!val && !obj.user && !obj.phone))
  @IsMongoId()
  office: string;

  @ApiPropertyOptional()
  @ValidateIf((obj, val) => (!val && !obj.office && !obj.user))
  @IsMongoId()
  phone: string;
}
