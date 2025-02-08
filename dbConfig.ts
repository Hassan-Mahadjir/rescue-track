import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  url: 'postgresql://RescueTrack:npg_Kwe4tpd9DNVC@ep-super-sound-a241nnav-pooler.eu-central-1.aws.neon.tech/RescueTrack?sslmode=require',
  type: 'postgres',
  port: 3306,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
