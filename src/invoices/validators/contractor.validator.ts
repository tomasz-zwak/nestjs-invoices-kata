import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { InvoiceItemDto } from '../dto/invoice-item.dto';

export function IsPercentage(
  property?: keyof InvoiceItemDto,
  validationOptions?: ValidationOptions,
) {
  return function (object: InvoiceItemDto, propertyName: string) {
    registerDecorator({
      name: 'isPercentage',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,

      validator: {
        validate(value: number, args: ValidationArguments) {
          return value >= 0 && value <= 1;
        },
        defaultMessage(args: ValidationArguments) {
          return `Value of ${propertyName} must be a percentage value (between 0.00 and 1.00)`;
        },
      },
    });
  };
}
