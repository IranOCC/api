import { ApiProperty, ApiPropertyOptional, } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import slugify from "slugify";
import { MailTemplate } from "src/email/schemas/mail_template.schema";
import { IsUnique } from "src/utils/decorator/unique.decorator";

export class CreateMailTemplateDto {
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
    @IsUnique(MailTemplate, "slug")
    slug: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    serviceID: string;
}
