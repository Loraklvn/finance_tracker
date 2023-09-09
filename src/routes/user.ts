import { Router } from 'express';

import { login, signup } from '../controllers/user';
import validateFields from '../middlewares/validateFields';
import { body } from 'express-validator';

const userRouter: Router = Router();

userRouter.post(
  `/login`,
  validateFields([
    body('email').isEmail().notEmpty(),
    body('password').isString().notEmpty(),
  ]),
  login,
);

userRouter.post(
  `/register`,
  validateFields([
    body('name').isString().notEmpty(),
    body('email').isEmail().notEmpty(),
    body('password').isString().notEmpty(),
  ]),
  signup,
);

export default userRouter;
