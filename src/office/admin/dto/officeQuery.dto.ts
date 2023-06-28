import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";

class OfficeSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { OfficeSortingDto }









class OfficeFilteringDto {
    @ApiPropertyOptional({ name: "filter[verified]", enum: ["True", "False"] })
    @Transform(({ value }) => {
        return ([1, true, 'True'].includes(value)) ? true : false
    })
    @IsOptional()
    readonly verified?: boolean;

    @ApiPropertyOptional({ name: "filter[active]", enum: ["True", "False"] })
    @Transform(({ value }) => {
        return ([1, true, 'True'].includes(value)) ? true : false
    })
    @IsOptional()
    readonly active?: boolean;
}


export { OfficeFilteringDto }
