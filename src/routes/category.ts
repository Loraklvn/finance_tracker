import { Router } from 'express';
import { body } from 'express-validator';
import { PATH_CATEGORY } from '../constants/paths';
import { createUserCategory, getCategories } from '../controllers/category';
import validateFields from '../middlewares/validateFields';

const categoryRouter: Router = Router();

categoryRouter.get(PATH_CATEGORY, getCategories);

categoryRouter.post(
  `${PATH_CATEGORY}/user`,
  validateFields([
    body('value').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('type').isString().notEmpty(),
  ]),
  createUserCategory,
);

export default categoryRouter;
