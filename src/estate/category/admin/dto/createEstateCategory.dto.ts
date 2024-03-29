import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength, } from "class-validator";
import slugify from "slugify";
import { EstateCategory } from "../../schemas/estateCategory.schema";
import { IsUnique } from "src/utils/decorator/unique.decorator";

export class CreateEstateCategoryDto {
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
    @IsUnique(EstateCategory, "slug")
    slug: string;

    @ApiPropertyOptional()
    @IsOptional()
    @MinLength(10)
    description: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    icon: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    tags: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    parent: string;
}
