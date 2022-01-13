import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import {
  Currency,
  InvoiceCalculationMethod,
  PaymentMethod,
} from '../invoice.type';
import { Contractor } from '../../contractors/entities/contractor.entity';
import { InvoiceItem } from './invoice-item.entity';
import { defaultAccountingPeriod } from '../../commons/utils/utils';
import { Exclude } from 'class-transformer';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) //todo: if not provided autogenerate
  invoiceNo: string;

  @Column({ type: 'date', default: null })
  issuedAt: Date; //if not provided same as createdAt

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'date', default: null })
  saleDate: Date; //if not provided same as createdAt

  @Column({ type: 'date', default: defaultAccountingPeriod() })
  accountingPeriod: Date; //default: current month

  @Column({
    default: InvoiceCalculationMethod.NET,
    type: 'enum',
    enum: InvoiceCalculationMethod,
  })
  invoiceCalculationMethod: InvoiceCalculationMethod;

  @Column({ default: Currency.PLN, type: 'enum', enum: Currency })
  currency: string;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, {
    cascade: true,
  })
  invoiceItems: InvoiceItem[];

  @Column()
  comment: string;

  @Column({ default: PaymentMethod.CARD, type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'date' })
  paymentDeadline: Date;

  @Column({ default: null, type: 'decimal', precision: 13, scale: 2 })
  grossValue: number;

  @Column({ default: null, type: 'decimal', precision: 13, scale: 2 })
  vatValue: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'date' })
  paidDate: Date;

  @ManyToOne(() => Contractor, (contractor) => contractor.invoices)
  contractor: Contractor;

  @Exclude()
  @ManyToOne(() => User, (user) => user.invoices, { nullable: true })
  user: User;

  @Column({ default: false, nullable: false })
  approved: boolean;

  @Exclude()
  @Column({ nullable: true })
  fileName: string;

  @Exclude()
  @Column({ nullable: true })
  fileData: Buffer;

  @BeforeInsert()
  populateDates() {
    console.log('this is not working');
    this.populateIssuedAt();
    this.populateSaleDate();
    this.populateAccountingPeriod();
    this.populatePaymentDeadline();
  }

  populateIssuedAt() {
    if (!this.issuedAt) {
      this.issuedAt = this.createdAt;
    }
  }
  populateSaleDate() {
    if (!this.saleDate) {
      this.saleDate = new Date();
    }
  }
  populateAccountingPeriod() {
    if (!this.accountingPeriod) {
      this.accountingPeriod = this.createdAt;
    }
  }

  populatePaymentDeadline() {
    if (!this.paymentDeadline) {
      this.paymentDeadline = this.contractor.defaultPaymentDeadline;
    }
  }
}
