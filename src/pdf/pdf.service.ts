import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';
import Puppeteer from 'puppeteer';
import { QueueService } from '../queue/queue.service';
import { PdfData } from '../queue/queue.type';
import { PdfResponse, PdfTemplate, PdfTemplateData } from './pdf.type';

@Injectable()
export class PdfService {
  constructor(private readonly queueService: QueueService) {}

  preparePdf(pdfData: PdfData) {
    return this.pdfHandler(pdfData);
  }

  async generatePdf(
    pdfTemplate: PdfTemplate,
    data: PdfTemplateData,
  ): Promise<PdfResponse> {
    const path = this.getPath(pdfTemplate);
    const templateRaw = readFileSync(path).toString();

    const template = Handlebars.compile(templateRaw);
    const html = template({ ...data });

    const browser = await Puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'a4' });
    await browser.close();

    return { name: `${data.invoice.invoiceNo}`, data: pdf };
  }

  private getPath(templateName: string) {
    return join(__dirname, 'templates', `${templateName}.template.hbs`);
  }

  private pdfHandler(data: PdfData) {
    return {
      data: () => data,
      generate: () => this.queueService.enqueuePdf(data),
    };
  }
}
