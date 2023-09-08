import { Transaction } from 'typeorm';
import { Category } from './category';
import { User } from './user';

export const entityList = [User, Category, Transaction];
