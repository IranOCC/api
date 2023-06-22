import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { EmailDto } from "src/email/dto/email.dto";
import { PhoneDto } from "src/phone/dto/phone.dto";



export class GetMeResponseDto {
    @ApiProperty()
    @Expose()
    _id: string;

    @ApiProperty()
    @Expose()
    roles: string[];

    @ApiProperty()
    @Expose()
    firstName: string;

    @ApiProperty()
    @Expose()
    lastName: string;

    @ApiProperty()
    @Expose()
    fullName: string;

    @ApiProperty()
    @Expose()
    avatar: string;

    @ApiProperty()
    @Expose()
    accountToken: string;

    @ApiProperty()
    @Expose()
    verified: string;

    @ApiProperty()
    @Expose()
    active: string;

    @ApiProperty()
    @Expose()
    province: string;

    @ApiProperty()
    @Expose()
    city: string;

    @ApiProperty()
    @Expose()
    address: string;

    @ApiProperty()
    @Expose()
    location: string;


    @ApiProperty()
    @Expose()
    phone: PhoneDto;

    @ApiProperty()
    @Expose()
    email: EmailDto;
}
