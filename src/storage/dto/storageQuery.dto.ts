import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";
import { RelatedToEnum } from "src/utils/enum/relatedTo.enum";

class StorageSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { StorageSortingDto }









class StorageFilteringDto {
    @ApiPropertyOptional({ name: "filter[relatedTo]", enum: RelatedToEnum })
    @IsEnum(RelatedToEnum)
    @IsOptional()
    readonly relatedTo?: RelatedToEnum;


    @ApiPropertyOptional({ name: "filter[relatedToID]", })
    @IsMongoId()
    @IsOptional()
    readonly relatedToID?: string;

    @ApiPropertyOptional({ name: "filter[uploadedBy]", })
    @IsMongoId()
    @IsOptional()
    readonly uploadedBy?: string;
}


export { StorageFilteringDto }
