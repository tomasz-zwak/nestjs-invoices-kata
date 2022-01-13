import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('contractors')
@Controller('contractors')
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.contractorsService.findAll(user);
  }

  @Get('countries')
  listCountries() {
    return this.contractorsService.listCountries();
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.contractorsService.findOne(id, user);
  }

  @Post()
  create(
    @Body() contractorDto: CreateContractorDto,
    @CurrentUser() user: User,
  ) {
    return this.contractorsService.create(contractorDto, user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() contractorDto: UpdateContractorDto) {
    return this.contractorsService.update(id, contractorDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.contractorsService.delete(id, user);
  }
}
