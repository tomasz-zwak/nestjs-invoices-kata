import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceItemCategory } from './invoice-item-category.entity';
import { Invoice } from './invoice.entity';
import { Unit } from './unit.entity';

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems)
  invoice: Invoice;

  @OneToOne(() => InvoiceItemCategory)
  @JoinColumn()
  category: InvoiceItemCategory;

  @Column()
  amount: number;

  @OneToOne(() => Unit)
  @JoinColumn()
  unit: Unit;

  @Column()
  price: number;

  @Column()
  discount: number; //0.00 - 1.00 for percentage values

  @Column()
  vatRate: number; //0.00 - 1.00 for percentage values
}
