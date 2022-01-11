import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class UniqueExceptionFilter<T extends QueryFailedError>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const error = {
      name: exception.name,
      message: exception.message,
    };

    response.status(HttpStatus.BAD_REQUEST).json(error);
  }
}
