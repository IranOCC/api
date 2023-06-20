import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';




export class PhoneNumberDto {
    @ApiProperty()
    @Transform(({ value }) => {
        if (value.length === 10) value = '0' + value;
        return value.replace(/^0/, "+98");
    })
    @IsPhoneNumber("IR", {
        message: i18nVM(`validation.IsPhoneNumber`),
    })
    phone: string;
}



export class PhoneValueDto {
    @ApiProperty()
    @Transform(({ value }) => {
        if (value.length === 10) value = '0' + value;
        return value.replace(/^0/, "+98");
    })
    @IsPhoneNumber("IR", {
        message: i18nVM(`validation.IsPhoneNumber`),
    })
    value: string;
}