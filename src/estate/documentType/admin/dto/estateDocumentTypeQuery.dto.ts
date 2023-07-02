import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";

class EstateDocumentTypeSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { EstateDocumentTypeSortingDto }









class EstateDocumentTypeFilteringDto {
    @ApiPropertyOptional({ name: "filter[categories]", isArray: true, })
    @IsMongoId({ each: true })
    @IsOptional()
    readonly categories?: string[];
}


export { EstateDocumentTypeFilteringDto }
