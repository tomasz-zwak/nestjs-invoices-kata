import { ConfigModule } from '@nestjs/config';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Country {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
