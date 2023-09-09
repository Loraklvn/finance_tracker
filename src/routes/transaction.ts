import { Router } from 'express';
import { body, query } from 'express-validator';

import { PATH_TRANSACTION } from '../constants/paths';
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionsSummary,
  getTransactionsSummaryByCategory,
  updateTransaction,
} from '../controllers/transaction';
import validateFields from '../middlewares/validateFields';
import { TransactionTypes } from '../types/transaction';

const transactionRouter: Router = Router();

transactionRouter.get(
  PATH_TRANSACTION,
  validateFields([
    query('page').optional().isInt(),
    query('pageSize').optional().isInt(),
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
  ]),
  getTransactions,
);

const validateTypeEnum = (value: TransactionTypes): boolean => {
  if (!Object.values(TransactionTypes).includes(value)) {
    throw new Error('Invalid type value');
  }
  return true;
};

transactionRouter.post(
  PATH_TRANSACTION,
  validateFields([
    body('amount').isNumeric().notEmpty(),
    body('note').optional().isString().notEmpty(),
    body('type').isString().notEmpty().custom(validateTypeEnum),
    body('category_id').isNumeric().notEmpty(),
    body('date').isISO8601(),
  ]),
  createTransaction,
);

transactionRouter.put(
  `${PATH_TRANSACTION}/:id`,
  validateFields([
    body('amount').optional().isNumeric().notEmpty(),
    body('note').optional().isString().notEmpty(),
    body('type').optional().isString().notEmpty().custom(validateTypeEnum),
    body('category_id').optional().isNumeric().notEmpty(),
    body('date').optional().isISO8601(),
  ]),
  updateTransaction,
);

transactionRouter.delete(`${PATH_TRANSACTION}/:id`, deleteTransaction);

transactionRouter.get(
  `${PATH_TRANSACTION}/summary`,
  validateFields([
    query('startDate').isISO8601().toDate(),
    query('endDate').isISO8601().toDate(),
  ]),

  getTransactionsSummary,
);

transactionRouter.get(
  `${PATH_TRANSACTION}/summary/category`,
  validateFields([
    query('startDate').isISO8601().toDate(),
    query('endDate').isISO8601().toDate(),
  ]),
  getTransactionsSummaryByCategory,
);

export default transactionRouter;
