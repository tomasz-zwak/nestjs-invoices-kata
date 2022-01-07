import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { PdfService } from './pdf/pdf.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pdfService: PdfService,
  ) {}
  @Get('pdf')
  async testpdf(@Res({ passthrough: true }) res: Response) {
    const pdf = await this.pdfService.pdftest();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${pdf.name}`,
    });
    return new StreamableFile(pdf.data);
  }
}
