import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.queue'],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.BULL_HOST,
        port: +process.env.BULL_PORT,
      },
    }),
    BullModule.registerQueue({
      name: 'mail',
    }),
    BullModule.registerQueue({
      name: 'pdf',
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
