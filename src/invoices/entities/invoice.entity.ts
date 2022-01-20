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
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Invoice {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true }) //todo: if not provided autogenerate
  invoiceNo: string;

  @Field(() => Date)
  @Column({ type: 'date', default: null })
  issuedAt: Date; //if not provided same as createdAt

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date)
  @Column({ type: 'date', default: null })
  saleDate: Date; //if not provided same as createdAt

  @Field(() => Date)
  @Column({ type: 'date', default: defaultAccountingPeriod() })
  accountingPeriod: Date; //default: current month

  @Field(() => InvoiceCalculationMethod)
  @Column({
    default: InvoiceCalculationMethod.NET,
    type: 'enum',
    enum: InvoiceCalculationMethod,
  })
  invoiceCalculationMethod: InvoiceCalculationMethod;

  @Field()
  @Column({ default: Currency.PLN, type: 'enum', enum: Currency })
  currency: string;

  @Field(() => [InvoiceItem])
  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, {
    cascade: true,
  })
  invoiceItems: InvoiceItem[];

  @Field()
  @Column()
  comment: string;

  @Field(() => PaymentMethod)
  @Column({ default: PaymentMethod.CARD, type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Field(() => Date)
  @Column({ type: 'date' })
  paymentDeadline: Date;

  @Field(() => Float)
  @Column({ default: null, type: 'decimal', precision: 13, scale: 2 })
  grossValue: number;

  @Field(() => Float)
  @Column({ default: null, type: 'decimal', precision: 13, scale: 2 })
  vatValue: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 13, scale: 2, default: 0 })
  paidAmount: number;

  @Field(() => Date)
  @Column({ type: 'date' })
  paidDate: Date;

  @Field(() => Contractor)
  @ManyToOne(() => Contractor, (contractor) => contractor.invoices)
  contractor: Contractor;

  @Exclude()
  @ManyToOne(() => User, (user) => user.invoices, { nullable: true })
  user: User;

  @Field()
  @Column({ default: false, nullable: false })
  approved: boolean;

  @Exclude()
  @Column({ nullable: true })
  fileName: string;

  @Exclude()
  @Column({ nullable: true, type: 'mediumblob' })
  fileData: Buffer;

  @BeforeInsert()
  populateDates() {
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
