import { Contractor } from './entities/contractor.entity';

export type ContractorTemplateData = Pick<
  Contractor,
  'name' | 'building' | 'street' | 'postalCode' | 'city' | 'email' | 'taxId'
>;
