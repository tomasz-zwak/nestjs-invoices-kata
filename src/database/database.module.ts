/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseConfig } from './database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadOrmConfig } from './load-orm-config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabaseConfig)],
      inject: [DatabaseConfig.KEY],
      useFactory: async (databaseConfig: ConfigType<typeof DatabaseConfig>) =>
        loadOrmConfig(databaseConfig),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
