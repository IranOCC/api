import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";

import { RoleEnum } from "src/user/enum/role.enum";

class EstateTypeSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { EstateTypeSortingDto }









class EstateTypeFilteringDto {
    @ApiPropertyOptional({ name: "filter[categories]", })
    @IsMongoId({ each: true })
    @IsOptional()
    readonly categories?: string[];
}


export { EstateTypeFilteringDto }
