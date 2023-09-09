import { Transaction } from 'src/entities/transaction';
import { Repository, SelectQueryBuilder } from 'typeorm';

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
    .select()
    .where('transaction.user_id = :user_id', { user_id: userId })
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
