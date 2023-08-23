import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { EstateFavoritePublicService } from './estateFavorite.public.service';
import { MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';





@Controller('estateFavorite')
@ApiTags("EstateFavorite")
@ApiBearerAuth()
export class EstateFavoritePublicController {
  constructor(private readonly estateFavoritePublicService: EstateFavoritePublicService) { }


  @Post(":id")
  @ApiOperation({ summary: "Add to favorite", description: "No Description" })
  @ApiResponse({ status: 200 })
  add(@Param() { id }: MongoIDQueryDto, @Request() { user }) {
    return this.estateFavoritePublicService.add(id, user);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove from favorite", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto, @Request() { user }) {
    return this.estateFavoritePublicService.add(id, user);
  }


}
