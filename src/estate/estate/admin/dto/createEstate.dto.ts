import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "aws-sdk/clients/appstream";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsLatLong, IsLongitude, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import slugify from "slugify";
import { Office } from "src/office/schemas/office.schema";
import { EstateStatusEnum } from "../../enum/estateStatus.enum";
import { EstateVisibilityEnum } from "../../enum/estateVisibility.enum";
import { Estate } from "../../schemas/estate.schema";
import { IsUnique } from "src/utils/decorator/unique.decorator";

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
    @IsUnique(Estate, "slug")
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


    // ==> tags & categories
    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty()
    @IsMongoId()
    category: string;




    // ==> status
    @ApiPropertyOptional({ enum: EstateStatusEnum })
    @IsOptional()
    @IsEnum(EstateStatusEnum)
    status: string = EstateStatusEnum.Publish;

    @ApiPropertyOptional({ enum: EstateVisibilityEnum })
    @IsOptional()
    @IsEnum(EstateVisibilityEnum)
    visibility: string = EstateVisibilityEnum.Public;

    @ApiPropertyOptional()
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
    owner: string;





    // ===========================================================
    // ===========================================================
    // === general
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;


    // ======
    @ApiProperty()
    @IsMongoId()
    type?: string;

    @ApiProperty()
    @IsMongoId()
    documentType?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId({ each: true })
    features?: string[];




    @ApiProperty()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsPositive()
    area?: number;

    @ApiProperty()
    @Transform(({ value }) => (parseInt(value.replaceAll(",", "")) || 0))
    @IsPositive()
    price?: number;

    @ApiProperty()
    @Transform(({ value }) => (parseInt(value.replaceAll(",", "")) || 0))
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
    @IsPositive()
    roomsCount?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    @IsPositive()
    mastersCount?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    @IsPositive()
    buildingArea?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    @IsPositive()
    floorsCount?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    @IsPositive()
    unitsCount?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => (parseInt(value) || 0))
    @IsOptional()
    @IsPositive()
    floor?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    withOldBuilding?: boolean;




    // location
    @ApiProperty()
    @IsString()
    province: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    district: string;

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




}
