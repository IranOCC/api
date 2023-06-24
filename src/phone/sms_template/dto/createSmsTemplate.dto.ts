import { ApiProperty, } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsObject, IsString } from "class-validator";
import slugify from "slugify";

export class CreateSmsTemplateDto {
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
    @IsString()
    @IsNotEmpty()
    content: string;
}
