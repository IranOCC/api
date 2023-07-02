import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { RoleEnum } from "src/user/enum/role.enum";
import { provincesList } from "../data";




class ProvinceFilteringDto { }
export { ProvinceFilteringDto }





class CityFilteringDto {
    @ApiPropertyOptional({ name: "filter[province]", enum: provincesList.map(({ title }) => title) })
    @IsOptional()
    readonly province?: string;
}


export { CityFilteringDto }