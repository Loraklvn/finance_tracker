import { Repository, SelectQueryBuilder } from 'typeorm';

import { Transaction } from '../entities/transaction';

// Defines the parameters for building the transaction query
type TransactionQueryParams = {
  userId: string;
  page: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
};

/**
 * Builds a query for fetching transactions based on specified criteria.
 * @param transactionRepository - The repository for the Transaction entity.
 * @param params - The query parameters.
 * @returns A SelectQueryBuilder for executing the transaction query.
 */
export const buildGetTransactionsQuery = (
  transactionRepository: Repository<Transaction>,
  { userId, page, pageSize, startDate, endDate }: TransactionQueryParams,
): SelectQueryBuilder<Transaction> => {
  const queryBuilder = transactionRepository
    .createQueryBuilder('transaction')
    .select(['transaction.*', 'category.description AS category'])
    .leftJoin('transaction.category', 'category')
    .where('transaction.user_id = :userId', { userId })
    .orderBy('transaction.date', 'DESC')
    .skip((page - 1) * pageSize)
    .take(pageSize);

  if (startDate) {
    queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
  }
  if (endDate) {
    queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
  }

  return queryBuilder;
};

// Defines the parameters for building the transaction summary query
type TransactionSummaryQueryParams = {
  userId: string;
  startDate?: string;
  endDate?: string;
};

/**
 * Builds a query for summarizing transactions (total income, total expenses, balance) based on specified criteria.
 * @param transactionRepository - The repository for the Transaction entity.
 * @param params - The query parameters.
 * @returns A SelectQueryBuilder for executing the transaction summary query.
 */
export const buildGetTransactionsSummaryQuery = (
  transactionRepository: Repository<Transaction>,
  { userId, startDate, endDate }: TransactionSummaryQueryParams,
): SelectQueryBuilder<Transaction> => {
  const queryBuilder = transactionRepository
    .createQueryBuilder('transaction')
    .select(
      'SUM(CASE WHEN type = :income THEN amount ELSE 0 END)',
      'total_income',
    )
    .addSelect(
      'SUM(CASE WHEN type = :expense THEN amount ELSE 0 END)',
      'total_expenses',
    )
    .addSelect(
      'SUM(CASE WHEN type = :income THEN amount ELSE -amount END)',
      'balance',
    )
    .setParameters({ income: 'income', expense: 'expense' })
    .where('transaction.user_id = :userId', { userId });

  if (startDate) {
    queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
  }
  if (endDate) {
    queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
  }

  return queryBuilder;
};

type TransactionSummaryByCategoryQueryParams = {
  userId: string;
  startDate?: string;
  endDate?: string;
  type: string;
};

/**
 * Builds a query for summarizing transactions by category based on specified criteria.
 * @param transactionRepository - The repository for the Transaction entity.
 * @param params - The query parameters.
 * @returns A SelectQueryBuilder for executing the transaction summary by category query.
 */
export const buildGetTransactionsSummaryByCategoryQuery = (
  transactionRepository: Repository<Transaction>,
  { userId, startDate, endDate, type }: TransactionSummaryByCategoryQueryParams,
): SelectQueryBuilder<Transaction> => {
  const queryBuilder = transactionRepository
    .createQueryBuilder('transaction')
    .select([
      'transaction.category_id AS category_id',
      'category.description AS category',
      'transaction.type AS type',
      'SUM(transaction.amount) AS total',
      `(SELECT MAX(sub_trans.date) FROM transaction sub_trans 
      WHERE sub_trans.category_id = transaction.category_id) AS last_transaction_date
      `,
    ])
    .leftJoin('transaction.category', 'category')
    .where('transaction.user_id = :userId', { userId })
    .andWhere('transaction.type = :type', { type });

  if (startDate) {
    queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
  }
  if (endDate) {
    queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
  }

  queryBuilder.groupBy('category.category_id');

  return queryBuilder;
};
