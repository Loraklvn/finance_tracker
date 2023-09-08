import { DataSource } from 'typeorm';

import { entityList } from './entities';

export const appDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_CONNECTION_HOST,
  port: parseInt(process.env.DB_CONNECTION_PORT || ''),
  username: process.env.DB_CONNECTION_USERNAME,
  password: process.env.DB_CONNECTION_DB_PASSWORD,
  database: process.env.DB_CONNECTION_DB_NAME,
  synchronize: true,
  logging: true,
  entities: entityList,
  subscribers: [],
  migrations: [],
});
