import {
  IsOptional,
  IsEnum,
  IsMongoId,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';




export class UploadFromUrlDto {
  @ApiProperty()
  @IsUrl({ protocols: ['https'] })
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({ enum: RelatedToEnum })
  @IsOptional()
  @IsEnum(RelatedToEnum)
  relatedTo: RelatedToEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  relatedToID: string;
}
