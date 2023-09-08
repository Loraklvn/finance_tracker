import { Router } from 'express';

import userRouter from './user';
import categoryRouter from './category';
import { authChecker } from '../middlewares/authChecker';
import { errorHandler } from '../middlewares/errorHandler';

const routers = [userRouter, categoryRouter];

const mainRouter = Router();

// Apply the authChecker middleware globally for all routes except public ones
mainRouter.use((req, res, next) => {
  const publicRoutes = ['/login', '/register'];

  console.log({ url: req.url });

  if (publicRoutes.includes(req.url)) {
    // Skip authentication for public routes (e.g., login and signup)
    return next();
  }

  authChecker(req, res, next);
});

mainRouter.use(errorHandler);

mainRouter.use(routers);

export default mainRouter;
