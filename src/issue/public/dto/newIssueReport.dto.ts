import { ApiProperty, } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty } from "class-validator";
import { RelatedToEnum } from "src/utils/enum/relatedTo.enum";


export class NewIssueReportDto {
    @ApiProperty({ enum: RelatedToEnum })
    @IsEnum(RelatedToEnum)
    relatedTo: RelatedToEnum = null;

    @ApiProperty()
    @IsMongoId()
    relatedToID: string;

    @ApiProperty()
    @IsNotEmpty()
    content: string;
}

