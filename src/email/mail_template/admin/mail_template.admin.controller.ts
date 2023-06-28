import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Request,
  Query
} from '@nestjs/common';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIDQueryDto, MongoArrayIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { CreateMailTemplateDto } from '../dto/createMailTemplate.dto';
import { UpdateMailTemplateDto } from '../dto/updateMailTemplate.dto';
import { MailTemplateServiceAdmin } from './mail_template.admin.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { MailTemplateFilteringDto, MailTemplateSortingDto } from './dto/mailTemplateQuery.dto';



@Controller('admin/mailTemplate')
@Roles(RoleEnum.SuperAdmin)
@ApiBearerAuth()
@ApiTags('MailTemplate')
export class MailTemplateControllerAdmin {
  constructor(private mailTemplateService: MailTemplateServiceAdmin) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateMailTemplateDto) {
    return this.mailTemplateService.create(data);
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200 })
  findAll(@Query('filter') filter: MailTemplateFilteringDto, @Query('sort') sort: MailTemplateSortingDto, @Query() paginate: PaginationDto) {
    return this.mailTemplateService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.mailTemplateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateMailTemplateDto) {
    return this.mailTemplateService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.mailTemplateService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.mailTemplateService.bulkRemove(id);
  }

}


