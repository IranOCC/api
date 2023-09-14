import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsMongoId, ValidateNested, IsLatLong } from "class-validator";
import { EmailDto } from "src/email/dto/email.dto";
import { PhoneDto } from "src/phone/dto/phone.dto";


export class UpdateMe {
    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        return !!value?._id ? value?._id : value
    })
    @IsMongoId()
    avatar: string;

    // @ApiPropertyOptional()
    // @IsOptional()
    // @Type(() => EmailDto)
    // @ValidateNested()
    // email: EmailDto;

    // @ApiProperty()
    // @Type(() => PhoneDto)
    // @ValidateNested()
    // phone: PhoneDto;

    @ApiPropertyOptional()
    @IsOptional()
    nationalCode: string;

    @ApiPropertyOptional()
    @IsOptional()
    birthday: string;
}
