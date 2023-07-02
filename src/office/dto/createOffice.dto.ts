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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { EmailDto } from 'src/email/dto/email.dto';
import { PhoneDto } from 'src/phone/dto/phone.dto';




export class CreateOfficeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(10)
  description: string;

  @ApiProperty()
  @IsMongoId()
  management: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    return !!value?._id ? value?._id : value
  })
  @IsMongoId()
  logo: string;



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


  @ApiPropertyOptional({ default: false })
  @IsOptional()
  verified: boolean = false;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  active: boolean = true;
}
