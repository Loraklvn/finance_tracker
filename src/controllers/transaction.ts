import { Response } from 'express';
import { MAX_PAGE_SIZE } from 'src/constants';
import { ERROR_MESSAGES } from 'src/constants/apiMessages';
import { HTTP_STATUS, HTTP_STATUS_CODE } from 'src/constants/httpCodes';
import { appDataSource } from 'src/data-source';
import { Transaction } from 'src/entities/transaction';
import { CustomRequest } from 'src/types';
import { validateDates, validatePageParams } from 'src/utils';

export const getTransactions = async (req: CustomRequest, res: Response) => {
  const { user_id } = req?.user || {};

  const { page = 1, pageSize = 10, startDate, endDate } = req.query;

  const parsedPage = parseInt(page as string);
  const parsedPageSize = parseInt(pageSize as string);
  const validatedPageSize = Math.min(parsedPageSize, MAX_PAGE_SIZE);

  if (!validatePageParams(parsedPage, validatedPageSize)) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
      status: HTTP_STATUS.ERROR,
      message: ERROR_MESSAGES.PAGE_PAGESIZE_NOT_VALID,
    });
    return;
  }

  if (!validateDates([startDate as string, endDate as string])) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
      status: HTTP_STATUS.ERROR,
      message: ERROR_MESSAGES.DATE_NOT_VALID,
    });
    return;
  }

  const [transactions, total] = await appDataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .select()
    .where('transaction.user_id = :user_id', { user_id })
    .andWhere('transaction.date >= :startDate', { startDate })
    .andWhere('transaction.date <= :endDate', { endDate })
    .orderBy('transaction.date', 'DESC')
    .skip((parsedPage - 1) * validatedPageSize)
    .take(validatedPageSize)
    .getManyAndCount();

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
  const { user_id } = req?.user || {};

  const { amount, note, type, category_id, date } = req.body;

  const transaction = await Transaction.create({
    amount,
    note,
    type,
    category_id,
    user_id: parseInt(user_id as string),
    date,
  }).save();

  res.json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      transaction,
    },
  });
};
