import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Country } from './country.entity';
import { Invoice } from './invoice.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity()
export class Contractor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  privatePerson: boolean;

  @OneToMany(() => Invoice, (invoice) => invoice.contractor)
  invoices: Invoice[];

  @OneToOne(() => Country)
  @JoinColumn()
  country: Country;

  @Column()
  taxId: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  building: string;

  @Column()
  postalCode: string;

  @OneToOne(() => PaymentMethod)
  @JoinColumn()
  paymentMethod: PaymentMethod;

  @Column()
  defaultPaymentDeadline: string;

  @Column()
  email: string;
}
