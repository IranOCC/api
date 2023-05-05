import {
  IsEmail,
  IsAlphanumeric,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { PHONE_COUNTRY_CODE, PHONE_COUNTRY_REGION } from '../../config/main';
import { EmailDto } from 'src/email/dto/email.dto';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { Storage } from "src/storage/schemas/storage.schema"
import { RoleEnum } from '../enum/role.enum';



const $ = 'validation.CreateUserDto';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.firstName.IsNotEmpty`) })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.lastName.IsNotEmpty`) })
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  avatar: Storage;

  @ApiProperty()
  @IsEnum(RoleEnum, { each: true, message: i18nVM(`${$}.roles.IsEnum`) })
  roles: string[];

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
  location: [number, number];

  @ApiPropertyOptional()
  @IsOptional()
  verified: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  active: boolean;
}
