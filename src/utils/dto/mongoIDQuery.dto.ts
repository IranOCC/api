import { ApiParam, ApiProperty, ApiPropertyOptional, ApiQuery } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsOptional, IsPositive } from "class-validator";

export class MongoIDQueryDto {
    @ApiProperty()
    @IsMongoId()
    id: string;
}
