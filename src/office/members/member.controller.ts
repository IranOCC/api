import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { MongoIDQueryDto, MongoArrayIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';

import { MemberService } from './member.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';





@Controller('admin/office/:office_id/member')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
@ApiTags('Office')
@ApiBearerAuth()
export class MemberController {
  constructor(private readonly memberService: MemberService) { }

  @Post()
  @ApiOperation({ summary: "Add members", description: "No Description" })
  @ApiResponse({ status: 201 })
  add(@Param('office_id') office_id: string, @Query() { id }: MongoArrayIDQueryDto) {
    return this.memberService.add(office_id, id);
  }

  @Get()
  @ApiOperation({ summary: "Get list of members", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  @ApiParam({ name: 'office_id' })
  findAll(@Param('office_id') office_id: string, @Query() paginate: PaginationDto) {
    return this.memberService.findAll(office_id, paginate);
  }



  @Delete(':id')
  @ApiOperation({ summary: "Delete single member by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'office_id' })
  remove(@Param('office_id') office_id: string, @Param() { id }: MongoIDQueryDto) {
    return this.memberService.remove(office_id, id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of members by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'office_id' })
  bulkRemove(@Param('office_id') office_id: string, @Query() { id }: MongoArrayIDQueryDto) {
    return this.memberService.remove(office_id, id);
  }


}
