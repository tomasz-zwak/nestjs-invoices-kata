import { Contractor } from '../contractors/entities/contractor.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { User } from '../user/entities/user.entity';

export type PdfTemplateData = {
  invoice: Invoice;
  contractor: Contractor;
  user: User;
};

export type PdfResponse = {
  name: string;
  data: Buffer;
};

export enum PdfTemplate {
  INVOICE = 'invoice',
}
