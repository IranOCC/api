import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    @ApiPropertyOptional({ default: 1 })
    @Transform(({ value, obj }) => parseInt(value))
    @IsPositive()
    @IsOptional()
    current: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @Transform(({ value, obj }) => parseInt(value))
    @IsPositive()
    @IsOptional()
    size: number = 10;
}
