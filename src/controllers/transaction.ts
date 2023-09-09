import { NextFunction, Response } from 'express';

import { MAX_PAGE_SIZE } from '../constants';
import { ERROR_MESSAGES } from '../constants/apiMessages';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../constants/httpCodes';
import { TRANSACTION_ALLOWED_UPDATE_FIELDS } from '../constants/transaction';
import { appDataSource } from '../data-source';
import { Transaction } from '../entities/transaction';
import {
  buildGetTransactionsQuery,
  buildGetTransactionsSummaryByCategoryQuery,
  buildGetTransactionsSummaryQuery,
} from '../queries/transaction';
import { CustomRequest } from '../types';
import { TransactionTypes } from '../types/transaction';

export const getTransactions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req?.user?.user_id as string;
    const {
      page = 1,
      pageSize = MAX_PAGE_SIZE,
      startDate,
      endDate,
    } = req.query;

    const parsedPage = parseInt(page as string);
    const parsedPageSize = parseInt(pageSize as string);
    const validatedPageSize = Math.min(parsedPageSize, MAX_PAGE_SIZE);

    const transactionRepository = appDataSource.getRepository(Transaction);

    const transactionsQuery = buildGetTransactionsQuery(transactionRepository, {
      userId,
      page: parsedPage,
      pageSize: validatedPageSize,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    const [transactions, total] = await transactionsQuery.getManyAndCount();

    const summaryQuery = buildGetTransactionsSummaryQuery(
      transactionRepository,
      {
        userId,
        startDate: startDate as string,
        endDate: endDate as string,
      },
    );
    const summary = await summaryQuery.getRawOne();

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        total,
        pageSize: parsedPageSize,
        currentPage: parsedPage,
        totalPages: parseInt(`${Math.ceil(total / validatedPageSize)}`),
        ...summary,
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req?.user?.user_id as string;

    const { amount, note, type, category_id: categoryID, date } = req.body;

    const transaction = await Transaction.create({
      amount,
      note,
      type,
      category_id: categoryID,
      user_id: parseInt(userId),
      date,
    }).save();

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req?.user?.user_id as string;
    const { id } = req.params;

    const transaction = await Transaction.findOneBy({
      transaction_id: parseInt(id),
      user_id: parseInt(userId),
    });

    if (!transaction) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
      });
      return;
    }

    TRANSACTION_ALLOWED_UPDATE_FIELDS.forEach((field) => {
      if (field in req.body) {
        transaction[field as 'amount'] = req.body[field];
      }
    });

    await transaction.save();

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req?.user?.user_id as string;

    const { id } = req.params;

    const transaction = await Transaction.findOneBy({
      transaction_id: parseInt(id),
      user_id: parseInt(userId),
    });

    if (!transaction) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
      });
      return;
    }

    await transaction.remove();

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionsSummary = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req?.user?.user_id as string;
    const { startDate, endDate } = req.query;

    const transactionRepository = appDataSource.getRepository(Transaction);

    const summaryQuery = buildGetTransactionsSummaryQuery(
      transactionRepository,
      {
        userId,
        startDate: startDate as string,
        endDate: endDate as string,
      },
    );
    const summary = await summaryQuery.getRawOne();

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        ...summary,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionsSummaryByCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req?.user?.user_id as string;
    const { startDate, endDate } = req.query;

    const transactionRepository = appDataSource.getRepository(Transaction);

    const params = {
      userId,
      startDate: startDate as string,
      endDate: endDate as string,
    };

    const summaryExpensesQuery = buildGetTransactionsSummaryByCategoryQuery(
      transactionRepository,
      { type: TransactionTypes.EXPENSE, ...params },
    );
    const summaryExpenses = await summaryExpensesQuery.getRawMany();

    const summaryIncomeQuery = buildGetTransactionsSummaryByCategoryQuery(
      transactionRepository,
      { type: TransactionTypes.INCOME, ...params },
    );

    const summaryIncome = await summaryIncomeQuery.getRawMany();

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        expenses: summaryExpenses,
        income: summaryIncome,
      },
    });
  } catch (error) {
    next(error);
  }
};
