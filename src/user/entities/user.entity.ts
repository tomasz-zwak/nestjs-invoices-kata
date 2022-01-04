import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];
}
