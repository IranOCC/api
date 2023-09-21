import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";

class EstateSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { EstateSortingDto }



enum CRPFiltering {
    confirmed = "confirmed",
    rejected = "rejected",
    pending = "pending",
}





class EstateFilteringDto {
    @ApiPropertyOptional({ name: "filter[category]" })
    @IsOptional()
    @IsMongoId({ each: true })
    readonly category?: string[];

    @ApiPropertyOptional({ name: "filter[createdBy]" })
    @IsOptional()
    @IsMongoId({ each: true })
    readonly createdBy?: string[];

    @ApiPropertyOptional({ name: "filter[office]" })
    @IsOptional()
    @IsMongoId({ each: true })
    readonly office?: string[];

    @ApiPropertyOptional({ name: "filter[crp]", enum: CRPFiltering, isArray: true })
    @IsOptional()
    @IsEnum(CRPFiltering, { each: true, })
    readonly crp?: string[];
}


export { EstateFilteringDto }
