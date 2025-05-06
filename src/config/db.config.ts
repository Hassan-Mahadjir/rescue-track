import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';
import { registerAs } from '@nestjs/config';

export const databaseConfig = {
  primary: registerAs(
    'dbconfig.primary',
    (): PostgresConnectionOptions => ({
      url: process.env.ATK_DATABASE_URL,
      type: 'postgres',
      port: Number(process.env.ATK_DATABASE_PORT),
      entities: [path.resolve(__dirname, '../entities/main/*.entity{.ts,.js}')],
      synchronize: true,
    }),
  ),
  secondary: registerAs(
    'dbconfig.secondary',
    (): PostgresConnectionOptions => ({
      url: process.env.ATK_MAIN_DATABASE_URL,
      type: 'postgres',
      port: Number(process.env.ATK_MAIN_DATABASE_PORT),
      entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ),
};

export default databaseConfig;
