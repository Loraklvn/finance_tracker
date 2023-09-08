import { Router } from 'express';
import { PATH_CATEGORY } from '../constants/paths';
import { createUserCategory, getCategories } from '../controllers/category';

const categoryRouter: Router = Router();

categoryRouter.get(PATH_CATEGORY, getCategories);

categoryRouter.post(`${PATH_CATEGORY}/user`, createUserCategory);

export default categoryRouter;
