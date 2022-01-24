import { ContractorTemplateData } from '../contractors/contractor.type';
import { InvoiceTemplateData } from '../invoices/invoice.type';
import { UserTemplateData } from '../user/user.type';

export type MailData = {
  user: UserTemplateData;
  invoice: InvoiceTemplateData;
  contractor: ContractorTemplateData;
};

export type MailAlertTemplateData = MailData;

export type MailUserAccountTemplateData = Pick<MailData, 'user'>;
