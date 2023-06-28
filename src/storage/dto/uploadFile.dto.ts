import { ApiProperty } from "@nestjs/swagger";
import { BufferedFile } from "../file.type";

export class UploadFileDto {
    @ApiProperty({ type: 'string', isArray: true, format: 'binary', description: 'Image file to upload' })
    files: any;
}