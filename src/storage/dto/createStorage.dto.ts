import {
  IsOptional,
  IsEnum,
  IsMongoId,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';




export class CreateStorageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ enum: RelatedToEnum })
  @IsEnum(RelatedToEnum)
  relatedTo: RelatedToEnum;

  @ApiProperty()
  @IsMongoId()
  relatedToID: string;
}
