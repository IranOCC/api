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
import { PagePublicService } from "./page.public.service"



@Public()
@Controller('page')
@ApiTags("Page")
@ApiBearerAuth()
export class PagePublicController {
  constructor(private readonly pagePublicService: PagePublicService) { }

  @Get(':id_or_slug')
  @ApiOperation({ summary: "Get single Model by id or slug", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOneBySlugOrID(@Param('id_or_slug') id_or_slug: string) {
    return this.pagePublicService.findOneBySlugOrID(id_or_slug);
  }
}
