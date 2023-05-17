import {
  IsEmail,
  IsOptional,
  MinLength,
  IsNotEmpty,
  IsMongoId,
  ValidateNested,
  IsLatLong
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Storage } from "src/storage/schemas/storage.schema"
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { EmailDto } from 'src/email/dto/email.dto';



const $ = 'validation.CreateOfficeDto';




export class CreateOfficeDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.name.IsNotEmpty`) })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(10, { message: i18nVM(`${$}.description.MinLength`) })
  description: string;

  @ApiProperty()
  @IsMongoId({ message: i18nVM(`${$}.management.IsMongoId`) })
  management: string;

  @ApiPropertyOptional()
  @IsOptional()
  logo: Storage;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => EmailDto)
  @ValidateNested()
  email: EmailDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => PhoneDto)
  @ValidateNested()
  phone: PhoneDto;

  @ApiPropertyOptional()
  @IsOptional()
  province: string;

  @ApiPropertyOptional()
  @IsOptional()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLatLong()
  location: string;

  @ApiPropertyOptional()
  @IsOptional()
  verified: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  active: boolean;
}
