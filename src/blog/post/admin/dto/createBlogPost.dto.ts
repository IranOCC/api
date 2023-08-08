import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "aws-sdk/clients/appstream";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsLatLong, IsLongitude, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from "class-validator";
import slugify from "slugify";
import { PostStatusEum } from "../../enum/postStatus.enum";
import { PostVisibilityEum } from "../../enum/postVisibility.enum";
import { BlogPost } from "../../schemas/blogPost.schema";
import { IsUnique } from "src/utils/decorator/unique.decorator";


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
    @IsUnique(BlogPost, "slug")
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




    // ==> tags & categories
    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId({ each: true })
    categories: string[];






    // ==> status
    @ApiPropertyOptional({ enum: PostStatusEum })
    @IsOptional()
    @IsEnum(PostStatusEum)
    status: string = PostStatusEum.Publish;

    @ApiPropertyOptional({ enum: PostVisibilityEum })
    @IsOptional()
    @IsEnum(PostVisibilityEum)
    visibility: string = PostVisibilityEum.Public;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    pinned: boolean = false;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    publishedAt: string = new Date().toISOString();



    @ApiProperty()
    @IsMongoId()
    office: string;

    @ApiProperty()
    @IsMongoId()
    author: string;

}

