import { ISendMailOptions } from '@nestjs-modules/mailer';
import { PdfTemplate, PdfTemplateData } from '../pdf/pdf.type';

export type MailData = ISendMailOptions;

export type PdfData = {
  template: PdfTemplate;
  data: PdfTemplateData;
};
