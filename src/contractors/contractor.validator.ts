import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../invoices/dto/update-invoice.dto';

export function RequireContractorIdOrNew(
  property: keyof CreateInvoiceDto,
  validationOptions?: ValidationOptions,
) {
  return function (
    object: CreateInvoiceDto | UpdateInvoiceDto,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'requireContractorIdOrNew',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: number, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return !(value === undefined && relatedValue === undefined);
        },
      },
    });
  };
}
