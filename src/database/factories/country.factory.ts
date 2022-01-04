import { define } from 'typeorm-seeding';
import { Country } from '../../invoices/entities/country.entity';
import * as Faker from 'faker';

define(Country, (faker: typeof Faker) => {
  const country = new Country();
  const countryName = Faker.unique(faker.address.country);

  country.name = countryName;

  return country;
});
