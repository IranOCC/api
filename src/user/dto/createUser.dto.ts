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
import { UserStatusEum } from '../enum/userStatus.enum';
import { EmailDto } from 'src/email/dto/email.dto';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { Storage } from "src/storage/schemas/storage.schema"



const $ = 'validation.CreateUserDto';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.firstName.IsNotEmpty`) })
  firstName: string | null | undefined;

  @ApiProperty()
  @IsNotEmpty({ message: i18nVM(`${$}.lastName.IsNotEmpty`) })
  lastName: string | null | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  avatar: Storage;

  @ApiProperty({ enum: UserStatusEum })
  @IsEnum(UserStatusEum, { message: i18nVM(`${$}.status.IsEnum`) })
  status: string;

  @ApiProperty()
  roles: string[] | null | undefined;

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
