import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { OfficeServicePublic } from './office.public.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';





@Controller('office')
@Public()
@ApiTags('Office')
@ApiBearerAuth()
export class OfficeControllerPublic {
  constructor(private readonly officeServicePublic: OfficeServicePublic) { }


  @Get()
  @ApiOperation({ summary: "Get list of Model with filtering", description: "No Description" })
  @ApiResponse({ status: 200 })
  findAll(@Query() paginate: PaginationDto) {
    return this.officeServicePublic.findAll(paginate);
  }

}
