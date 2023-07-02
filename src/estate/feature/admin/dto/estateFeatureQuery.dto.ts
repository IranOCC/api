import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";

class EstateFeatureSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { EstateFeatureSortingDto }









class EstateFeatureFilteringDto {
    @ApiPropertyOptional({ name: "filter[categories]", isArray: true, })
    @IsMongoId({ each: true })
    @IsOptional()
    readonly categories?: string[];
}


export { EstateFeatureFilteringDto }
