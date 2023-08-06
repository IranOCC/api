import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional, IsPositive, IsString } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";

class WebEstateSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { WebEstateSortingDto }









class WebEstateFilteringDto {
    @ApiPropertyOptional({ name: "filter[category]" })
    @IsOptional()
    @IsMongoId()
    readonly category?: string;

    @ApiPropertyOptional({ name: "filter[type]" })
    @IsOptional()
    @IsMongoId({ each: true })
    readonly type?: string[];

    @ApiPropertyOptional({ name: "filter[documentType]" })
    @IsOptional()
    @IsMongoId({ each: true })
    readonly documentType?: string[];

    @ApiPropertyOptional({ name: "filter[features]" })
    @IsOptional()
    @IsMongoId({ each: true })
    readonly features?: string[];

    @ApiPropertyOptional({ name: "filter[province]" })
    @IsOptional()
    @IsString()
    readonly province?: string;

    @ApiPropertyOptional({ name: "filter[city]" })
    @IsOptional()
    @IsString()
    readonly city?: string;

    @ApiPropertyOptional({ name: "filter[district]" })
    @IsOptional()
    @IsString({ each: true })
    readonly district?: string[];

    // 

    @ApiPropertyOptional({ name: "filter[area]" })
    @IsOptional()
    readonly area?: number[] | number;

    @ApiPropertyOptional({ name: "filter[price]" })
    @IsOptional()
    readonly price?: number[] | number;

    @ApiPropertyOptional({ name: "filter[totalPrice]" })
    @IsOptional()
    readonly totalPrice?: number[] | number;

    // 

    @ApiPropertyOptional({ name: "filter[barter]", enum: ["True", "False"] })
    @Transform(({ value }) => {
        return ([1, true, 'True'].includes(value)) ? true : false
    })
    @IsOptional()
    readonly barter?: boolean;
}


export { WebEstateFilteringDto }
