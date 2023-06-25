import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class MongoIDQueryDto {
    @ApiProperty()
    @IsMongoId()
    id: string;
}



export class MongoArrayIDQueryDto {
    @ApiProperty()
    @IsMongoId({ each: true })
    id: string[];
}
