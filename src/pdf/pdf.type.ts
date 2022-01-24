import { ContractorTemplateData } from '../contractors/contractor.type';
import { InvoiceTemplateData } from '../invoices/invoice.type';
import { User } from '../user/entities/user.entity';

export type PdfTemplateData = {
  invoice: InvoiceTemplateData;
  contractor: ContractorTemplateData;
  user: User;
};

export type PdfResponse = {
  name: string;
  data: Buffer;
};

export enum PdfTemplate {
  INVOICE = 'invoice',
}
