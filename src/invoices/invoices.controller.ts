import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceApproveDto } from './dto/invoice-approve.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('/itemCategories')
  listItemCategories() {
    return this.invoicesService.listItemCategories();
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.invoicesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.invoicesService.findOne(id, user);
  }

  @Get(':id/invoiceItems')
  listInvoiceItems(@Param('id') id: number) {
    return this.invoicesService.listInvoiceItems(id);
  }

  @Patch(':id/approve')
  approveInvoice(
    @Param('id') id: number,
    @Body() approveDto: InvoiceApproveDto,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.approve(id, approveDto.approve, user);
  }

  @Post()
  create(@Body() invoiceDto: CreateInvoiceDto, @CurrentUser() user: User) {
    return this.invoicesService.create(invoiceDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() invoiceDto: UpdateInvoiceDto,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.update(id, invoiceDto, user);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.invoicesService.delete(id, user);
  }
}
