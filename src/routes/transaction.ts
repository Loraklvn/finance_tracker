import { Router } from 'express';
import { createTransaction, getTransactions } from '../controllers/transaction';

const transactionRouter: Router = Router();

transactionRouter.get('/transactions', getTransactions);

transactionRouter.post('/transactions', createTransaction);

export default transactionRouter;
