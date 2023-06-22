import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ForbiddenResponseDto {
    @ApiProperty({ example: 403 })
    @Expose()
    statusCode: number;

    @ApiProperty({ example: "You don't have access" })
    @Expose()
    message: string;

    @ApiProperty({ example: "Forbidden" })
    @Expose()
    error: string;
}
