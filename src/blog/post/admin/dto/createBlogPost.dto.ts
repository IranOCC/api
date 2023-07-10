import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "aws-sdk/clients/appstream";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsLatLong, IsLongitude, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import slugify from "slugify";
import { PostStatusEum } from "../../enum/postStatus.enum";
import { PostVisibilityEum } from "../../enum/postVisibility.enum";
import { Office } from "src/office/schemas/office.schema";


export class CreateBlogPostDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value, obj }: { value: string, obj: any }) => {
        const vv = value.length ? value : obj.title
        return slugify(vv, {
            replacement: "_",
            remove: undefined,
            lower: false,
            strict: false,
            locale: "fa",
            trim: true,
        })
    })
    slug: string;

    @ApiProperty()
    @IsNotEmpty()
    content?: string;

    @ApiProperty()
    @IsNotEmpty()
    excerpt?: string;



    @ApiPropertyOptional()
    @Transform(({ value }) => {
        return value?._id ? value?._id : value
    })
    @IsOptional()
    @IsMongoId()
    image?: string;



    // == status

    @ApiPropertyOptional({ enum: PostStatusEum, default: PostStatusEum.Pending })
    @IsOptional()
    @IsEnum(PostStatusEum)
    status: string = PostStatusEum.Pending;

    @ApiPropertyOptional({ enum: PostVisibilityEum, default: PostVisibilityEum.Public })
    @IsOptional()
    @IsEnum(PostVisibilityEum)
    visibility: string = PostVisibilityEum.Public;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    pinned: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    publishedAt: Date;


    // == tags
    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];


    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId({ each: true })
    categories: string[];


    // detail
    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    createdBy?: User | string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    confirmedBy?: User | string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    office?: Office | string;

}
