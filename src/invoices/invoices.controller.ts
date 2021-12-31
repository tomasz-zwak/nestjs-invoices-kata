import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  index() {
    return 'abc';
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return `findOne #${id}`;
  }

  @Post()
  create() {
    return 'findOne';
  }

  @Patch()
  update() {
    return 'findOne';
  }

  @Delete()
  delete() {
    return 'findOne';
  }
}
