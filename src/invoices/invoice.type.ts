import { registerEnumType } from '@nestjs/graphql';
import { Invoice } from './entities/invoice.entity';

export type InvoiceTemplateData = Pick<
  Invoice,
  | 'id'
  | 'createdAt'
  | 'invoiceNo'
  | 'invoiceItems'
  | 'paymentDeadline'
  | 'grossValue'
>;

export enum Currency {
  PLN = 'PLN',
  USD = 'USD',
}

export enum InvoiceCalculationMethod {
  NET = 'net',
  GROSS = 'gross',
}

export enum PaymentMethod {
  TRANSFER = 'transfer',
  CASH = 'cash',
  COMPENSATION = 'compensation',
  CARD = 'card',
  PAID = 'paid',
}

export enum MeasureUnit {
  PIECE = 'pc',
  KG = 'kg',
  SERVICE = 'svc',
  M2 = 'm2',
  LITER = 'l',
  PACKAGE = 'pckg',
  TON = 'ton',
  HOUR = 'h',
  NOT_APPLICABLE = 'not applicable',
}

registerEnumType(Currency, { name: 'Currency' });
registerEnumType(InvoiceCalculationMethod, {
  name: 'InvoiceCalculationMethod',
});
registerEnumType(PaymentMethod, { name: 'PaymentMethod' });
registerEnumType(MeasureUnit, { name: 'MeasureUnit' });

export type InvoiceCalculationResult = Pick<
  Invoice,
  'vatValue' | 'grossValue' | 'invoiceItems'
>;
