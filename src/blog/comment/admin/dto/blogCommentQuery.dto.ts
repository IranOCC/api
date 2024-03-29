import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

class BlogCommentSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { BlogCommentSortingDto }









class BlogCommentFilteringDto {
    // @ApiPropertyOptional({ name: "filter[verified]", enum: ["True", "False"] })
    // @Transform(({ value }) => {
    //     return ([1, true, 'True'].includes(value)) ? true : false
    // })
    // @IsOptional()
    // readonly verified?: boolean;

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


export { BlogCommentFilteringDto }
