import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';




export class EmailAddressDto {
    @ApiProperty()
    @Transform(({ value }) => value.toLowerCase())
    @IsEmail({}, { message: i18nVM(`validation.IsEmail`) })
    email: string;
}




export class EmailValueDto {
    @ApiProperty()
    @Transform(({ value }) => value.toLowerCase())
    @IsEmail({}, { message: i18nVM(`validation.IsEmail`) })
    value: string;
}