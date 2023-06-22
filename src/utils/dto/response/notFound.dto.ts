import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class NotFoundResponseDto {
    @ApiProperty({ example: 404 })
    @Expose()
    statusCode: number;

    @ApiProperty({ example: "Parameter not found" })
    @Expose()
    message: string;

    @ApiProperty({ example: "NotFound" })
    @Expose()
    error: string;
}
