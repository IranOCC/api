import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, MinLength, IsMongoId, IsString } from "class-validator";
import slugify from "slugify";
import { EstateDocumentType } from "../../schemas/estateDocumentType.schema";
import { IsUnique } from "src/utils/decorator/unique.decorator";

export class CreateEstateDocumentTypeDto {
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
    @IsUnique(EstateDocumentType, "slug")
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
    @IsMongoId({ each: true })
    categories: string[];
}
