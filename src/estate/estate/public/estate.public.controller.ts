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
import { EstatePublicService } from './estate.public.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { WebEstateFilteringDto, WebEstateSortingDto } from './dto/estateQuery.dto';




@Public()
@Controller('estate')
@ApiTags("Estate")
@ApiBearerAuth()
export class EstatePublicController {
  constructor(private readonly estatePublicService: EstatePublicService) { }

  @Get()
  @ApiOperation({ summary: "Get list of Model with filtering", description: "No Description" })
  @ApiResponse({ status: 200 })
  findAll(@Query('filter') filter: WebEstateFilteringDto, @Query('sort') sort: WebEstateSortingDto, @Query() paginate: PaginationDto) {
    return this.estatePublicService.findAll(paginate, filter, sort);
  }


  @Get(':id_or_slug')
  @ApiOperation({ summary: "Get single Model by id or slug", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOneBySlugOrID(@Param('id_or_slug') id_or_slug: string) {
    return this.estatePublicService.findOneBySlugOrID(id_or_slug);
  }
}
