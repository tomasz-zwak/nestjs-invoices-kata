import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
