import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from '../../invoices/invoice.type';
import { Country } from '../../invoices/entities/country.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { User } from '../../user/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { defaultPaymentDeadline } from '../../commons/utils/utils';
import { Exclude } from 'class-transformer';

@Entity()
@ObjectType()
export class Contractor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  privatePerson: boolean;

  @Exclude()
  @Field(() => [Invoice])
  @OneToMany(() => Invoice, (invoice) => invoice.contractor, {
    nullable: true,
  })
  invoices: Invoice[];

  @ManyToOne(() => Country, (country) => country.contractors)
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

  @Column({ default: PaymentMethod.CARD, type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'date', default: defaultPaymentDeadline() })
  defaultPaymentDeadline: Date;

  @Column()
  email: string;

  @ManyToOne(() => User, (user) => user.contractors)
  user: User;
}
