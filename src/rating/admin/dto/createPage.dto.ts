import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "aws-sdk/clients/appstream";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsLatLong, IsLongitude, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import slugify from "slugify";
import { PageStatusEum } from "src/page/enum/pageStatus.enum";
import { Page } from "src/page/schemas/page.schema";
import { IsUnique } from "src/utils/decorator/unique.decorator";


export class CreatePageDto {
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
    @IsUnique(Page, "slug")
    slug: string;

    @ApiProperty()
    @IsNotEmpty()
    content?: string;

    @ApiPropertyOptional({ enum: PageStatusEum })
    @IsOptional()
    @IsEnum(PageStatusEum)
    status: string = PageStatusEum.Publish;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    publishedAt: string = new Date().toISOString();


    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];
}
