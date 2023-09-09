import { NextFunction, Response } from 'express';

import { ERROR_MESSAGES } from '../constants/apiMessages';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../constants/httpCodes';
import { appDataSource } from '../data-source';
import { Category } from '../entities/category';
import { CustomRequest } from '../types';

export const getCategories = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req?.user?.user_id as string;

    const categories = await appDataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .select()
      .where('category.user_id = :user_id', { user_id: userId })
      .orWhere('category.user_id IS NULL')
      .getMany();

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createUserCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req?.user?.user_id as string;

    if (!userId) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.NOT_AUTHORIZED,
      });
      return;
    }

    const { value, description, type } = req.body;

    const category = await Category.create({
      value,
      description,
      type,
      user_id: parseInt(userId),
    }).save();

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};
