import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from './database.config';

export async function loadOrmConfig(
  databaseConfig: ConfigType<typeof DatabaseConfig>,
): Promise<TypeOrmModuleOptions> {
  return {
    type: 'mysql',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    synchronize: true,
    autoLoadEntities: true,
  };
}
