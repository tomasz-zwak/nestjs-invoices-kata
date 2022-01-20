import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MeasureUnit } from '../invoice.type';
import { InvoiceItemCategory } from './invoice-item-category.entity';
import { Invoice } from './invoice.entity';
@ObjectType()
@Entity()
export class InvoiceItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems, {
    onDelete: 'CASCADE',
  })
  invoice: Invoice;

  @ManyToOne(() => InvoiceItemCategory)
  category: InvoiceItemCategory;

  @Column()
  description: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'enum', enum: MeasureUnit })
  unit: MeasureUnit;

  @Column({ type: 'numeric', precision: 13, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 13, scale: 2 })
  discount: number; //0.00 - 1.00 for percentage values

  @Column({ type: 'decimal', precision: 13, scale: 2 })
  vatRate: number; //0.00 - 1.00 for percentage values

  @Column({ default: null, type: 'decimal', precision: 13, scale: 2 })
  grossValue: number;

  @Column({ default: null, type: 'decimal', precision: 13, scale: 2 })
  vatValue: number;
}
