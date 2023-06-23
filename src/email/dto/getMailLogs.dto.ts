import { IsEnum, IsMongoId, IsOptional, ValidateIf, } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional()
  @ValidateIf((obj, val) => (!val && !obj.office && !obj.email))
  @IsMongoId()
  user: string;

  @ApiPropertyOptional()
  @ValidateIf((obj, val) => (!val && !obj.user && !obj.email))
  @IsMongoId()
  office: string;

  @ApiPropertyOptional()
  @ValidateIf((obj, val) => (!val && !obj.office && !obj.user))
  @IsMongoId()
  email: string;
}
