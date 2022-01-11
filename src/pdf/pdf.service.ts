import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';
import * as Puppeteer from 'puppeteer';
import { PdfResponse, PdfTemplate, PdfTemplateData } from './pdf.type';

@Injectable()
export class PdfService {
  async generatePdf(
    pdfTemplate: PdfTemplate,
    data: PdfTemplateData,
  ): Promise<PdfResponse> {
    const path = this.getPath(pdfTemplate);
    const templateRaw = readFileSync(path).toString();

    const template = Handlebars.compile(templateRaw);
    const html = template({ ...data });

    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    page.setContent(html);
    const pdf = await page.pdf({ format: 'a4' });
    await browser.close();

    return { name: `${data.invoice.invoiceNo}`, data: pdf };
  }

  private getPath(templateName: string) {
    return join(__dirname, 'templates', `${templateName}.template.hbs`);
  }
}
