import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";



export class UserLoginResponseDto {
    @ApiProperty()
    @Expose()
    accessToken: string;
}