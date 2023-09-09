import { Response } from 'express';

import { MAX_PAGE_SIZE } from '../constants';
import { ERROR_MESSAGES } from '../constants/apiMessages';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../constants/httpCodes';
import { TRANSACTION_ALLOWED_UPDATE_FIELDS } from '../constants/transaction';
import { appDataSource } from '../data-source';
import { Transaction } from '../entities/transaction';
import { CustomRequest } from '../types';

export const getTransactions = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const userId = req?.user?.user_id as string;

  const { page = 1, pageSize = 10, startDate, endDate } = req.query;

  const parsedPage = parseInt(page as string);
  const parsedPageSize = parseInt(pageSize as string);
  const validatedPageSize = Math.min(parsedPageSize, MAX_PAGE_SIZE);

  const transactionRepository = await appDataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .select()
    .where('transaction.user_id = :user_id', { user_id: userId })
    .orderBy('transaction.date', 'DESC')
    .skip((parsedPage - 1) * validatedPageSize)
    .take(validatedPageSize);

  if (startDate) {
    transactionRepository.andWhere('transaction.date >= :startDate', {
      startDate,
    });
  }
  if (endDate) {
    transactionRepository.andWhere('transaction.date <= :endDate', { endDate });
  }

  const [transactions, total] = await transactionRepository.getManyAndCount();

  res.json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      total,
      pageSize: parsedPageSize,
      currentPage: parsedPage,
      totalPages: parseInt(`${Math.ceil(total / validatedPageSize)}`),
      transactions,
    },
  });
};

export const createTransaction = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
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
};

export const updateTransaction = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
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
};

export const deleteTransaction = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
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
};
