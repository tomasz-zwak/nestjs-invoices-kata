import { MailerOptions, TemplateAdapter } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import mjml2html from 'mjml';
import Handlebars from 'handlebars';
import * as path from 'path';
import { get } from 'lodash';
import { readFile } from 'fs';
// import i18next from 'i18next';
// import registerI18nHelper from 'handlebars-i18next';

type Mail = {
  data: {
    template: string;
    context: Record<string, any>;
    html: string;
  };
};

export class MjmlAdapter implements TemplateAdapter {
  compile(
    mail: Mail,
    callback: (err?: any, body?: string) => any,
    options: MailerOptions,
  ) {
    const template = mail.data.template;
    const templateExt = path.extname(template) || '.mjml';
    const templateName = path.basename(template, path.extname(template));
    const templateDir = template.startsWith('./')
      ? path.dirname(template)
      : get(options, 'template.dir', '');
    const templatePath = path.join(templateDir, templateName + templateExt);
    readFile(templatePath, 'utf8', (err, body) => {
      if (err) {
        return callback(err);
      }
      const compiledHbs = Handlebars.compile(body, { noEscape: true })({
        ...mail.data.context,
        ...(options.template ?? {}),
      });

      const mjmlParseResult = mjml2html(compiledHbs);

      mail.data.html = mjmlParseResult.html;
      return callback();
    });
  }
}
