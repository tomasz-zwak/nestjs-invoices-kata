import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../invoices/entities/country.entity';
import { User } from '../user/entities/user.entity';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { Contractor } from './entities/contractor.entity';

@Injectable()
export class ContractorsService {
  constructor(
    @InjectRepository(Contractor)
    private readonly contractorsRepository: Repository<Contractor>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(user: User) {
    return await this.contractorsRepository.find({
      where: {
        user,
      },
    });
  }

  async findOne(id: number, user: User) {
    const contractor = await this.contractorsRepository.findOne(id, {
      relations: ['country', 'invoices'],
      where: { user },
    });
    if (!contractor) {
      throw new NotFoundException(`Contractor #${id} could not be found.`);
    }
    return contractor;
  }

  async create(contractorDto: CreateContractorDto, user: User) {
    const country = await this.preloadCountryByName(contractorDto.country);
    const contractor = this.contractorsRepository.create({
      ...contractorDto,
      country,
      user,
    });
    return await this.contractorsRepository.save(contractor);
  }

  async update(id: number, contractorDto: UpdateContractorDto) {
    const country =
      contractorDto.country &&
      (await this.preloadCountryByName(contractorDto.country));
    const contractor = await this.contractorsRepository.preload({
      id: id,
      ...contractorDto,
      country,
    });
    if (!contractor) {
      throw new NotFoundException(`Contractor #${id} could not be found.`);
    }
    return this.contractorsRepository.save(contractor);
  }

  async delete(id: number, user: User) {
    const contractor = await this.findOne(id, user);
    try {
      await this.contractorsRepository.remove(contractor);
    } catch (error) {
      throw new NotFoundException(
        'Placeholder, implement custom exception filter - cannto delete contractor if invoices are attached',
      );
    }
  }

  //todo: seed countries and limit choice
  async preloadCountryByName(countryName: string) {
    let country = await this.countryRepository.findOne({ name: countryName });
    if (country) {
      return country;
    }
    country = this.countryRepository.create({ name: countryName });
    return this.countryRepository.save(country);
  }

  async listCountries() {
    return await this.countryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
