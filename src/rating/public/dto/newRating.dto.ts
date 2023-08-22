import { ApiProperty, } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { RelatedToEnum } from "src/utils/enum/relatedTo.enum";


export class NewRatingDto {
    @ApiProperty({ enum: RelatedToEnum })
    @IsEnum(RelatedToEnum)
    relatedTo: RelatedToEnum = null;

    @ApiProperty()
    @IsMongoId()
    relatedToID: string;

    @ApiProperty()
    @IsNumber()
    score: number;
}

