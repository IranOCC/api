import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsMongoId, IsOptional, IsString } from "class-validator";



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
    @IsString()
    readonly area?: string;

    @ApiPropertyOptional({ name: "filter[price]" })
    @IsOptional()
    @IsString()
    readonly price?: string;

    @ApiPropertyOptional({ name: "filter[totalPrice]" })
    @IsOptional()
    @IsString()
    readonly totalPrice?: string;

    // 

    @ApiPropertyOptional({ name: "filter[barter]", type: Boolean })
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    @IsOptional()
    readonly barter?: boolean;

    @ApiPropertyOptional({ name: "filter[swap]", type: Boolean })
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    @IsBoolean()
    @IsOptional()
    readonly swap?: boolean;

    @ApiPropertyOptional({ name: "filter[special]", type: Boolean })
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    @IsOptional()
    readonly special?: boolean;



    @ApiPropertyOptional({ name: "filter[dailyRent]", type: Boolean })
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    @IsOptional()
    readonly dailyRent?: boolean;

    @ApiPropertyOptional({ name: "filter[annualRent]", type: Boolean })
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    @IsOptional()
    readonly annualRent?: boolean;
}


export { WebEstateFilteringDto }
