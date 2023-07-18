import { Request, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { MongoIDQueryDto, MongoArrayIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';

import { OfficeMemberAdminService } from './member.admin.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';





@Controller('admin/office/:office_id/member')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
@ApiTags('Office')
@ApiBearerAuth()
export class OfficeMemberAdminController {
  constructor(private readonly memberAdminService: OfficeMemberAdminService) { }

  @Post()
  @ApiOperation({ summary: "Add members", description: "No Description" })
  @ApiResponse({ status: 201 })
  add(@Param('office_id') office_id: string, @Query() { id }: MongoArrayIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.memberAdminService.add(office_id, id, { ...user, offices });
  }

  @Get()
  @ApiOperation({ summary: "Get list of members", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  @ApiParam({ name: 'office_id' })
  findAll(@Param('office_id') office_id: string, @Query() paginate: PaginationDto, @Request() { user }, @Request() { offices }) {
    return this.memberAdminService.findAll(office_id, paginate, { ...user, offices });
  }



  @Delete(':id')
  @ApiOperation({ summary: "Delete single member by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'office_id' })
  remove(@Param('office_id') office_id: string, @Param() { id }: MongoIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.memberAdminService.remove(office_id, id, { ...user, offices });
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of members by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'office_id' })
  bulkRemove(@Param('office_id') office_id: string, @Query() { id }: MongoArrayIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.memberAdminService.remove(office_id, id, { ...user, offices });
  }


}
