import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DatabaseConfig } from './database.config';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DatabaseConfig.KEY)
    private readonly databaseConfig: ConfigType<typeof DatabaseConfig>,
  ) {}

  getConfig() {
    return this.databaseConfig;
  }
}
