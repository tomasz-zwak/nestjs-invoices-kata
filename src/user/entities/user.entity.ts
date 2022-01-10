import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { Role } from '../user.type';
import { randomUUID } from 'crypto';

@Unique(['email'])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  passwordExpired: boolean;

  @Column()
  confirmationId: string;

  @Column()
  passwordResetId: string;
}
