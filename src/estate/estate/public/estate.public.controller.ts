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




@Public()
@Controller('estate')
@ApiTags("Estate")
@ApiBearerAuth()
export class EstatePublicController {
  constructor(private readonly estatePublicService: EstatePublicService) { }

  @Get(':id_or_slug')
  @ApiOperation({ summary: "Get single Model by id or slug", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOneBySlugOrID(@Param('id_or_slug') id_or_slug: string) {
    return this.estatePublicService.findOneBySlugOrID(id_or_slug);
  }
}
