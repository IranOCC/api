import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "aws-sdk/clients/appstream";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsLatLong, IsLongitude, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import slugify from "slugify";
import { Office } from "src/office/schemas/office.schema";
import { EstateStatusEnum } from "../../enum/estateStatus.enum";
import { EstateVisibilityEnum } from "../../enum/estateVisibility.enum";

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
    @Transform(({ value }) => {
        return value?._id ? value?._id : value
    })
    @IsOptional()
    @IsMongoId()
    image?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => {
        return value.map((v: any) => (v?._id ? v?._id : v))
    })
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
    // @IsDate()
    @IsDateString({})
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
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsPositive()
    area?: number;

    @ApiProperty()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsPositive()
    price?: number;

    @ApiProperty()
    @Transform(({ value }) => (parseInt(value) || 0))
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
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    constructionYear?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    roomsCount?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    mastersCount?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    buildingArea?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    floorsCount?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    unitsCount?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
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
