import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
