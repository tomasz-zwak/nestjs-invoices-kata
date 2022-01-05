import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
@ApiTags('contractors')
@Controller('contractors')
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Get()
  findAll() {
    return this.contractorsService.findAll();
  }

  @Get('countries')
  listCountries() {
    return this.contractorsService.listCountries();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.contractorsService.findOne(id);
  }

  @Post()
  create(@Body() contractorDto: CreateContractorDto) {
    return this.contractorsService.create(contractorDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() contractorDto: UpdateContractorDto) {
    return this.contractorsService.update(id, contractorDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.contractorsService.delete(id);
  }
}
