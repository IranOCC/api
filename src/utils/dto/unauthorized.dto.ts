import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UnauthorizedDto {
    @ApiProperty({ example: 401 })
    @Expose()
    statusCode: number;

    @ApiProperty({ example: "Please login" })
    @Expose()
    message: string;

    @ApiProperty({ example: "Unauthorized" })
    @Expose()
    error: string;
}
