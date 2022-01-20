import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { map, Observable, tap } from 'rxjs';
import { InvoicesController } from '../invoices/invoices.controller';
import { PATH_METADATA } from '@nestjs/common/constants';

@Injectable()
export class InvoiceDownloadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = GqlExecutionContext.create(context).getContext().req;
    const protocol = req.protocol;
    const host = req.get('host');
    const invoicesPath = Reflect.getMetadata(PATH_METADATA, InvoicesController);
    let downloadPath = Reflect.getMetadata(
      PATH_METADATA,
      InvoicesController.prototype.download,
    );
    if (typeof downloadPath === 'string') {
      downloadPath = downloadPath.replace(':id', '');
    }
    let base = '';
    if (protocol && host && invoicesPath && downloadPath) {
      base = `${protocol}://${host}/${invoicesPath}/`;
    }
    return next.handle().pipe(
      map((data) => ({
        id: data.id,
        downloadUrl: `${base}${data.id}${downloadPath}`,
      })),
    );
  }
}
