import 'reflect-metadata';
import 'dotenv/config';
import { appDataSource } from './data-source';
import { initExpressServer } from './server/server';

const initAppServices = async (): Promise<void> => {
  await appDataSource.initialize();
  initExpressServer();
};

initAppServices().catch((e) => console.log('error: ', e));
