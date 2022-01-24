import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { queue } from 'rxjs';
import { QueueConfig } from './queue.config';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule.forFeature(QueueConfig)],
      inject: [QueueConfig.KEY],
      useFactory: (queueConfig: ConfigType<typeof QueueConfig>) => ({
        redis: {
          host: queueConfig.host,
          port: queueConfig.port,
        },
      }),
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
