import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';


// 9212728307
// 09212728307
// 989212728307
// +989212728307
// 00989212728307

export class PhoneNumberDto {
    @ApiProperty()
    @Transform(({ value }) => {
        if (value.substring(0, 1) === "0") value = value.substring(1);
        else if (value.substring(0, 2) === "98") value = value.substring(2);
        else if (value.substring(0, 3) === "+98") value = value.substring(3);
        else if (value.substring(0, 3) === "098") value = value.substring(3);
        else if (value.substring(0, 4) === "0098") value = value.substring(4);
        return "+98" + value;
    })
    @IsPhoneNumber("IR", {
        message: i18nVM(`validation.IsPhoneNumber`),
    })
    phone: string;
}



export class PhoneValueDto {
    @ApiProperty()
    @Transform(({ value }) => {
        if (value.substring(0, 1) === "0") value = value.substring(1);
        else if (value.substring(0, 2) === "98") value = value.substring(2);
        else if (value.substring(0, 3) === "+98") value = value.substring(3);
        else if (value.substring(0, 3) === "098") value = value.substring(3);
        else if (value.substring(0, 4) === "0098") value = value.substring(4);
        return "+98" + value;
    })
    @IsPhoneNumber("IR", {
        message: i18nVM(`validation.IsPhoneNumber`),
    })
    value: string;
}