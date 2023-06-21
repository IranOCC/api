import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class NotAcceptableDto {
    @ApiProperty({ example: 406 })
    @Expose()
    statusCode: number;

    @ApiProperty({ example: "Parameter is wrong" })
    @Expose()
    message: string;

    @ApiProperty({ example: "NotAcceptable" })
    @Expose()
    error: string;
}
