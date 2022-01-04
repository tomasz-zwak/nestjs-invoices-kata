import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeasureUnit } from '../invoice.type';
import { InvoiceItemCategory } from './invoice-item-category.entity';
import { Invoice } from './invoice.entity';

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems, {
    onDelete: 'CASCADE',
  })
  invoice: Invoice;

  @OneToOne(() => InvoiceItemCategory)
  @JoinColumn()
  category: InvoiceItemCategory;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: MeasureUnit })
  unit: MeasureUnit;

  @Column()
  price: number;

  @Column()
  discount: number; //0.00 - 1.00 for percentage values

  @Column()
  vatRate: number; //0.00 - 1.00 for percentage values
}
