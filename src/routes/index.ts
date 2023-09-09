import { Router } from 'express';

import { authChecker } from '../middlewares/authChecker';
import { errorHandler } from '../middlewares/errorHandler';

import categoryRouter from './category';
import transactionRouter from './transaction';
import userRouter from './user';

const routers = [userRouter, categoryRouter, transactionRouter];

const mainRouter = Router();

// Apply the authChecker middleware globally for all routes except public ones
mainRouter.use((req, res, next) => {
  const publicRoutes = ['/login', '/register'];

  if (publicRoutes.includes(req.url)) {
    // Skip authentication for public routes (e.g., login and signup)
    return next();
  }

  authChecker(req, res, next);
});

mainRouter.use(errorHandler);

mainRouter.use(routers);

export default mainRouter;
