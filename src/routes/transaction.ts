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
import { validateDate } from '../utils';

const transactionRouter: Router = Router();

transactionRouter.get(
  PATH_TRANSACTION,
  validateFields([
    query('page').optional().isInt(),
    query('pageSize').optional().isInt(),
    validateDate(query('startDate')),
    validateDate(query('endDate')),
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
    body('note').optional().isString(),
    body('type').isString().notEmpty().custom(validateTypeEnum),
    body('category_id').isNumeric().notEmpty(),
    validateDate(body('date')),
  ]),
  createTransaction,
);

transactionRouter.put(
  `${PATH_TRANSACTION}/:id`,
  validateFields([
    body('amount').optional().isNumeric().notEmpty(),
    body('note').optional().isString(),
    body('type').optional().isString().notEmpty().custom(validateTypeEnum),
    body('category_id').optional().isNumeric().notEmpty(),
    validateDate(body('date')),
  ]),
  updateTransaction,
);

transactionRouter.delete(`${PATH_TRANSACTION}/:id`, deleteTransaction);

transactionRouter.get(
  `${PATH_TRANSACTION}/summary`,
  validateFields([
    validateDate(query('startDate')),
    validateDate(query('endDate')),
  ]),

  getTransactionsSummary,
);

transactionRouter.get(
  `${PATH_TRANSACTION}/summary/category`,
  validateFields([
    validateDate(query('startDate')),
    validateDate(query('endDate')),
  ]),
  getTransactionsSummaryByCategory,
);

export default transactionRouter;
