import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Country } from '../../invoices/entities/country.entity';

export default class CreateCountries implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Country)().createMany(10);
  }
}
