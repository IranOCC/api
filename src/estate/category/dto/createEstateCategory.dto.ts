import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, MinLength, ValidateIf } from "class-validator";
import slugify from "slugify";

export class CreateEstateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @ValidateIf(o => !!o.title)
    @Transform(({ value, obj }: { value: string, obj: any }) => {
        const vv = value ? value : obj.title
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
    tags: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    parent: string;
}
