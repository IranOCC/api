import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhoneOtpResponseDto } from 'src/auth/dto/response/phoneOtp.dto';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { GetMailLogsDto } from '../dto/getMailLogs.dto';
import { SendMailDto } from '../dto/sendMail.dto';
import { EmailService } from '../email.service';
import { MailLogFilteringDto, MailLogSortingDto } from './dto/mailLogQuery.dto';

@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
@Controller('admin/mail')
@ApiTags('Mail')
@ApiBearerAuth()
export class MailController {
    constructor(private readonly emailService: EmailService) { }

    @Post()
    @ApiOperation({ summary: "Send single email to email address", description: "Mail subject: (context.$subject or base on template)", })
    @ApiResponse({ status: 200 })
    send(@Body() data: SendMailDto, @Request() { user }) {
        return this.emailService.sendSingleMail(data, user);
    }

    @Get()
    @ApiOperation({ summary: "Get list of mail logs", description: "No Description", })
    @ApiResponse({ status: 200 })
    listLogs(@Query('filter') filter: MailLogFilteringDto, @Query('sort') sort: MailLogSortingDto, @Query() paginate: PaginationDto) {
        return this.emailService.getMailLogs(paginate, filter, sort);
    }
}
