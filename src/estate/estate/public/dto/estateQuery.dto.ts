import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
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

    // @ApiPropertyOptional({ name: "filter[active]", enum: ["True", "False"] })
    // @Transform(({ value }) => {
    //     return ([1, true, 'True'].includes(value)) ? true : false
    // })
    // @IsOptional()
    // readonly active?: boolean;

    // @ApiPropertyOptional({ name: "filter[roles]", isArray: true, enum: RoleEnum })
    // @Transform(({ value }) => {
    //     return Array.isArray(value) ? { $in: value } : value
    // })
    // @IsOptional()
    // readonly roles?: RoleEnum[];
}


export { WebEstateFilteringDto }
