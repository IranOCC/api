import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class MongoIDQueryDto {
    @ApiProperty()
    @IsMongoId()
    id: string;
}
