import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Contractor } from '../../contractors/entities/contractor.entity';

@Entity()
@Unique(['name'])
export class Country {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @OneToMany(() => Contractor, (contractor) => contractor.country)
  contractors: Contractor[];
}
