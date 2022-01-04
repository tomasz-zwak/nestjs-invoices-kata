/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    ConfigModule.forFeature(DatabaseConfig),
    ConfigModule.forRoot({
      envFilePath: ['.env.mysql', '.env.postgres'],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
