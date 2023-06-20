import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';


export class EmailAddressDto {
    @ApiProperty()
    @Transform(({ value }) => value.toLowerCase())
    @IsEmail()
    email: string;
}
