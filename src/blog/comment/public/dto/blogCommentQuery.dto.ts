import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsOptional, IsString } from "class-validator";



class WebBlogCommentSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { WebBlogCommentSortingDto }









class WebBlogCommentFilteringDto {
    @ApiPropertyOptional({ name: "filter[replyTo]" })
    @IsOptional()
    @IsMongoId()
    readonly replyTo?: string;
}


export { WebBlogCommentFilteringDto }
