import { ApiProperty, } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsObject, IsString } from "class-validator";
import slugify from "slugify";
import { SmsTemplate } from "src/phone/schemas/sms_template.schema";
import { IsUnique } from "src/utils/decorator/unique.decorator";

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
    @IsUnique(SmsTemplate, "slug")
    slug: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;
}
