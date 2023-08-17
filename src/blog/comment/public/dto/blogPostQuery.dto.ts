import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsOptional, IsString } from "class-validator";



class WebBlogPostSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { WebBlogPostSortingDto }









class WebBlogPostFilteringDto {

}


export { WebBlogPostFilteringDto }
