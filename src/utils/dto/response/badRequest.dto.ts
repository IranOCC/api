import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class BadRequestResponseDto {
    @ApiProperty({ example: 400 })
    @Expose()
    statusCode: number;

    @ApiProperty({ example: "Bad Request" })
    @Expose()
    message: string | string[];

    @ApiProperty({ example: {} })
    @Expose()
    errors: { [key: string]: string };
}
