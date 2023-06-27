import { ApiExtraModels, ApiProperty, ApiPropertyOptional, ApiQuery, ApiResponseProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsJSON, IsObject, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { User } from "src/user/schemas/user.schema";



export class PaginationDto {
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




export class ListResponseDto {
    @ApiResponseProperty({})
    @Expose()
    items: number[];

    @ApiResponseProperty()
    @Expose()
    total: number;
}
