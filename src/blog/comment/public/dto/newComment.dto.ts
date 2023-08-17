import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "aws-sdk/clients/appstream";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsLatLong, IsLongitude, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from "class-validator";
import slugify from "slugify";
import { PhoneNumberDto } from "src/phone/dto/phoneNumber.dto";
import { IsUnique } from "src/utils/decorator/unique.decorator";


export class NewCommentDto extends PhoneNumberDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    // phone

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    replyTo?: string;
}

