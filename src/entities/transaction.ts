import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TransactionTypes } from '../types/transaction';

import { Category } from './category';
import { User } from './user';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @Column()
  amount: number;

  @Column()
  note: string;

  @Column({ type: 'enum', enum: TransactionTypes })
  type: TransactionTypes;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  category_id: number;

  @ManyToOne(() => Category, (category) => category.category_id)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
