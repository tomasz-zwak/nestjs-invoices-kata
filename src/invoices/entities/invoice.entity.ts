import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from '../types/invoice-types';
import { Contractor } from './contractor.entity';
import { InvoiceItem } from './invoice-item.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() //todo: autogenerating
  invoiceNo: string;

  @Column({ type: 'date' })
  issuedAt?: string; //if not provided same as createdAt

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({ type: 'date' })
  saleDate?: string; //if not provided same as createdAt

  @Column({ type: 'date' })
  accountingPeriod: string;

  @Column({ default: 'net' })
  invoiceCalculationMethod: string;

  @Column({ default: Currency.PLN, type: 'enum', enum: Currency })
  currency: string;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  invoiceItems: InvoiceItem[];

  @Column()
  comment: string;

  @OneToOne(() => PaymentMethod)
  @JoinColumn()
  paymentMethod: PaymentMethod;

  @Column({ type: 'date' })
  paymentDeadline: string;

  @Column({ type: 'decimal' })
  paidAmount: number;

  @Column({ type: 'date' })
  paidDate: string;

  @ManyToOne(() => Contractor, (contractor) => contractor.invoices)
  contractor: Contractor;
}
