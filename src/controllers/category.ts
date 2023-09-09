import { Request, Response } from 'express';
import { ERROR_MESSAGES } from '../constants/apiMessages';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../constants/httpCodes';
import { Category } from '../entities/category';
import { CustomRequest } from '../types';

export const getCategories = async (
  _: Request,
  res: Response,
): Promise<void> => {
  // TODO: get user categories
  res.json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      categories: await Category.find(),
    },
  });
};

export const createUserCategory = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const { user_id } = req?.user || {};

  if (!user_id) {
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
    user_id: parseInt(user_id),
  }).save();

  res.json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      category,
    },
  });
};
