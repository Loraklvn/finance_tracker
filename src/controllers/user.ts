import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';

import { ERROR_MESSAGES } from '../constants/apiMessages';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../constants/httpCodes';
import { User } from '../entities/user';
import {
  createAccessToken,
  isValidEmail,
  sendAccessToken,
} from '../utils/auth';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOneBy({ email });
    if (!user) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.WRONG_CREDENTIALS,
      });
      return;
    }

    const accessToken = createAccessToken(user);
    sendAccessToken(res, accessToken);

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.CREATE_USER_FIELDS_REQUIRED,
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.INVALID_EMAIL_ADDRESS,
      });
      return;
    }

    const userExist = await User.findOneBy({ email });

    if (userExist) {
      res.status(HTTP_STATUS_CODE.CONFLICT).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.USER_EXIST,
      });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    }).save();

    const accessToken = createAccessToken(user);
    sendAccessToken(res, accessToken);

    res.json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
