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
  Request
} from '@nestjs/common';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { SmsTemplateService } from './sms_template.service';
import { CreateSmsTemplateDto } from '../dto/createSmsTemplate.dto';
import { UpdateSmsTemplateDto } from '../dto/updateSmsTemplate.dto';
import { MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';



@ApiTags('SmsTemplate')
@Controller('admin/smsTemplate')
@Public()
export class SmsTemplateController {
  constructor(private smsTemplateService: SmsTemplateService) { }

  @Post()
  create(@Body() data: CreateSmsTemplateDto) {
    this.smsTemplateService.create(data);
  }

  @Get()
  findAll() {
    return this.smsTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.smsTemplateService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateSmsTemplateDto) {
    this.smsTemplateService.update(id, data);
  }

  @Delete(':id')
  remove(@Param() { id }: MongoIDQueryDto) {
    this.smsTemplateService.remove(id);
  }

}


