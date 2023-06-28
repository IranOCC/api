import {
  IsEmail,
  IsAlphanumeric,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
  IsLatLong,
  IsMongoId,
} from 'class-validator';
import { Type, } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';
import { EmailDto } from 'src/email/dto/email.dto';
import { Storage } from "src/storage/schemas/storage.schema"
import { RoleEnum } from '../enum/role.enum';
import { PhoneDto } from 'src/phone/dto/phone.dto';




export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  avatar: string;

  @ApiPropertyOptional({ default: [RoleEnum.User] })
  @IsOptional()
  @IsEnum(RoleEnum, { each: true, })
  roles: RoleEnum[] = [RoleEnum.User];



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
