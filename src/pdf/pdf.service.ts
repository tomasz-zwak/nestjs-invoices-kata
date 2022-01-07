import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';
import * as Puppeteer from 'puppeteer';

export type PDFTemplate = {
  path: string;
  options: Record<string, unknown>;
};

export type PDFResponse = {
  name: string;
  data: Buffer;
};

@Injectable()
export class PdfService {
  async pdftest(pdfTemplate?: PDFTemplate): Promise<PDFResponse> {
    const path = this.getPath('invoice.template');
    console.log(path);
    const templateRaw = readFileSync(path).toString();
    const template = Handlebars.compile(templateRaw);
    const context = { name: 'test user', data: 1232132132131 };
    const html = template(context);
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    page.setContent(html);
    const pdf = await page.pdf({ format: 'a4' });

    await browser.close();
    return { name: 'invoice.pdf', data: pdf };
  }

  private getPath(templateName: string) {
    return join(__dirname, 'templates', `${templateName}.hbs`);
  }
}
