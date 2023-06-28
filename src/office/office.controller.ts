import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/createOffice.dto';
import { UpdateOfficeDto } from './dto/updateOffice.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MemberService } from './member.service';



@Controller('office')
@ApiTags('Office')
@ApiBearerAuth()
export class OfficeController {
  constructor(
    private readonly officeService: OfficeService,
    private readonly memberService: MemberService,
  ) { }

  @Get('assignList')
  @Roles(RoleEnum.SuperAdmin)
  assignList(@Query('search') search: string) {
    return this.officeService.assignList(search);
  }

  // crud

  @Post()
  @Roles(RoleEnum.Admin)
  create(@Body() data: CreateOfficeDto) {
    return this.officeService.create(data);
  }

  @Get()
  @Roles(RoleEnum.Admin)
  findAll() {
    return this.officeService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.Admin)
  findOne(@Param('id') id: string) {
    return this.officeService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() data: UpdateOfficeDto) {
    return this.officeService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string) {
    return this.officeService.remove(id);
  }


  // members
  @Get(':id/member')
  @Roles(RoleEnum.Admin)
  async getMember(@Param('id') id: string) {
    const office = await this.officeService.getOrCheck(id)
    return await this.memberService.find(office)
  }

  @Post(':id/member')
  @Roles(RoleEnum.Admin)
  async addMember(@Param('id') id: string, @Body() members: string[]) {
    const office = await this.officeService.getOrCheck(id)
    return await this.memberService.add(office, members)
  }

  @Delete(':id/member')
  @Roles(RoleEnum.Admin)
  async removeMember(@Param('id') id: string, @Query('members') members: string[]) {
    const office = await this.officeService.getOrCheck(id)
    return await this.memberService.remove(office, members)
  }


}
