import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";

class UserSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { UserSortingDto }









class UserFilteringDto {
    @ApiPropertyOptional({ name: "filter[verified]", type: Boolean })
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    @IsBoolean()
    @IsOptional()
    readonly verified?: boolean;

    @ApiPropertyOptional({ name: "filter[active]", type: Boolean })
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    @IsBoolean()
    @IsOptional()
    readonly active?: boolean;

    @ApiPropertyOptional({ name: "filter[roles]", isArray: true, enum: RoleEnum })
    @Transform(({ value }) => {
        return Array.isArray(value) ? { $in: value } : value
    })
    @IsOptional()
    readonly roles?: RoleEnum[];
}


export { UserFilteringDto }
