import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "aws-sdk/clients/appstream";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsLatLong, IsLongitude, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import slugify from "slugify";
import { Office } from "src/office/schemas/office.schema";
import { EstateStatusEnum } from "../enum/estateStatus.enum";
import { EstateVisibilityEnum } from "../enum/estateVisibility.enum";

export class CreateEstateDto {
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

    @ApiPropertyOptional()
    @IsOptional()
    content?: string;

    @ApiPropertyOptional()
    @IsOptional()
    excerpt?: string;

    // == media

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId({ each: true })
    gallery?: string[];

    // == status

    @ApiProperty({ enum: EstateStatusEnum })
    @IsEnum(EstateStatusEnum)
    status: string;

    @ApiProperty({ enum: EstateVisibilityEnum })
    @IsEnum(EstateVisibilityEnum)
    visibility: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    pinned: boolean;

    @ApiProperty()
    @IsDate()
    publishedAt: Date;


    // == tags
    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];


    // == general
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;

    @ApiProperty()
    @IsMongoId()
    category: string;

    @ApiProperty()
    @IsMongoId()
    type?: string;

    @ApiProperty()
    @IsMongoId()
    documentType?: string[];

    @ApiProperty()
    @IsPositive()
    area?: number;

    @ApiProperty()
    @IsPositive()
    price?: number;

    @ApiProperty()
    @IsPositive()
    totalPrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    canBarter?: boolean;

    // == special
    @ApiPropertyOptional()
    @IsOptional()
    constructionYear?: number;

    @ApiPropertyOptional()
    @IsOptional()
    roomsCount?: number;

    @ApiPropertyOptional()
    @IsOptional()
    mastersCount?: number;

    @ApiPropertyOptional()
    @IsOptional()
    buildingArea?: number;

    @ApiPropertyOptional()
    @IsOptional()
    floorsCount?: number;

    @ApiPropertyOptional()
    @IsOptional()
    unitsCount?: number;

    @ApiPropertyOptional()
    @IsOptional()
    floor?: number;

    @ApiPropertyOptional()
    @IsOptional()
    withOldBuilding?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    features?: string[];


    // location
    @ApiProperty()
    @IsString()
    province?: string;

    @ApiProperty()
    @IsString()
    city?: string;

    @ApiProperty()
    @IsString()
    district?: string;

    @ApiProperty()
    @IsString()
    quarter?: string;

    @ApiPropertyOptional()
    @IsOptional()
    alley?: string;

    @ApiPropertyOptional()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsLatLong()
    location: string;



    @ApiPropertyOptional()
    @IsOptional()
    owner?: User | string;

    // detail
    @ApiPropertyOptional()
    @IsOptional()
    createdBy?: User | string;

    @ApiPropertyOptional()
    @IsOptional()
    confirmedBy?: User | string;

    @ApiPropertyOptional()
    @IsOptional()
    office?: Office | string;
}
