import { Router } from 'express';

import { login, signup } from '../controllers/user';

const userRouter: Router = Router();

userRouter.post(`/login`, login);

userRouter.post(`/register`, signup);

export default userRouter;
