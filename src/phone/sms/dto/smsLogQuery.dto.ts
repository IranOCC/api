import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsMongoId, IsOptional } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";
import { RelatedToEnum } from "src/utils/enum/relatedTo.enum";

class SmsLogSortingDto {
    @ApiPropertyOptional({ name: "sort[createdAt]", enum: ["Desc", "Asc"] })
    @Transform(({ value }) => {
        return ([1, true, 'True', 'Desc'].includes(value)) ? -1 : 1
    })
    @IsOptional()
    readonly createdAt?: number;
}

export { SmsLogSortingDto }









class SmsLogFilteringDto {
    @ApiProperty({ name: "filter[phone]" })
    @IsMongoId()
    readonly phone?: string;

    @ApiPropertyOptional({ name: "filter[user]" })
    @IsMongoId()
    @IsOptional()
    readonly user?: string;

    @ApiPropertyOptional({ name: "filter[office]" })
    @IsMongoId()
    @IsOptional()
    readonly office?: string;

    @ApiPropertyOptional({ name: "filter[relatedTo]", enum: RelatedToEnum })
    @IsEnum(RelatedToEnum)
    @IsOptional()
    readonly relatedTo?: RelatedToEnum;

    @ApiPropertyOptional({ name: "filter[relatedToID]", })
    @IsMongoId()
    @IsOptional()
    readonly relatedToID?: string;

    @ApiPropertyOptional({ name: "filter[sentBy]", })
    @IsMongoId()
    @IsOptional()
    readonly sentBy?: string;

    @ApiPropertyOptional({ name: "filter[template]", })
    @IsMongoId()
    @IsOptional()
    readonly template?: string;
}


export { SmsLogFilteringDto }
