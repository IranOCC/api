import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsOptional, IsPositive, IsString } from "class-validator";

export class AutoCompleteDto {
    @ApiPropertyOptional({ default: [] })
    // @IsMongoId({ each: true })
    // @Transform(({ value }) => {
    //     if (!Array.isArray(value)) return [value]
    // })
    @IsOptional()
    initial: string[] = [];

    @ApiPropertyOptional({ default: "" })
    @IsString()
    @IsOptional()
    search: string = "";

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
