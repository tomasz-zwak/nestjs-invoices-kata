import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('/itemCategories')
  listItemCategories() {
    return this.invoicesService.listItemCategories();
  }

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.invoicesService.findOne(id);
  }

  @Get(':id/invoiceItems')
  listInvoiceItems(@Param('id') id: number) {
    console.log('adadasdasdassad');
    return this.invoicesService.listInvoiceItems(id);
  }

  @Post()
  create(@Body() invoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(invoiceDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() invoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, invoiceDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.invoicesService.delete(id);
  }

  @Delete()
  deleteAll() {
    this.invoicesService.deleteAll();
  }
}
