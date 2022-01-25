import { ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceApproveDto } from './dto/invoice-approve.dto';
import { UpdateInvoiceDtoGql } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoicesService } from './invoices.service';
import { PdfResponse } from '../pdf/pdf.type';
import { InvoicePdfMetadata } from './invoice.dto';
import { InvoiceDownloadInterceptor } from '../commons/invoice-download.interceptor';

@Resolver(() => Invoice)
export class InvoicesResolver {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Query(() => Invoice)
  invoice(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.findOne(id, user);
  }

  @Query(() => [Invoice])
  invoices(@CurrentUser() user: User) {
    return this.invoicesService.findAll(user);
  }

  @Mutation(() => String)
  approve(
    @Args({ name: 'invoiceId', type: () => ID }) id: number,
    @Args('approve') approveDto: InvoiceApproveDto,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.approve(id, approveDto.approve, user);
  }

  @Query(() => Int)
  send(
    @Args({ name: 'invoiceId', type: () => ID }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.send(id, user);
  }

  @Mutation(() => Invoice)
  createInvoice(
    @Args('invoice') invoiceDto: CreateInvoiceDto,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.create(invoiceDto, user);
  }

  @Mutation(() => Invoice)
  updateInvoice(
    @Args({ name: 'invoiceId', type: () => ID }) id: number,
    @Args('invoice') invoiceDto: UpdateInvoiceDtoGql,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.update(id, invoiceDto, user);
  }

  @Mutation(() => Invoice)
  async deleteInvoice(
    @Args({ name: 'invoiceId', type: () => ID }) id: number,
    @CurrentUser() user: User,
  ) {
    const invoice = await this.invoicesService.delete(id, user);
    invoice.id = id;
    return invoice;
  }

  @UseInterceptors(InvoiceDownloadInterceptor)
  @Query(() => InvoicePdfMetadata)
  download(
    @Args({ name: 'invoiceId', type: () => ID }) id: number,
  ): InvoicePdfMetadata {
    return { id };
  }
}
