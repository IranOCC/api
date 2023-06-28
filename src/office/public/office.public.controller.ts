import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { OfficeServicePublic } from './office.public.service';





@Controller('office')
@Public()
@ApiTags('Office')
@ApiBearerAuth()
export class OfficeControllerPublic {
  constructor(private readonly officeServicePublic: OfficeServicePublic) { }


}
