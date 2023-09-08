import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { COOKIES } from '../constants';
import { ERROR_MESSAGES } from '../constants/apiMessages';
import { HTTP_STATUS_CODE } from '../constants/httpCodes';
import { CustomRequest, UserPayload } from '../types/index';

export const authChecker = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies[COOKIES.ACCESS_TOKEN_COOKIES_NAME];

  if (!token) {
    res
      .status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.TOKEN_MISSING });
    return;
  }

  try {
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.user = payload as UserPayload;
    next();
  } catch (error) {
    console.log({ error });
    res
      .status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.NOT_AUTHORIZED });
  }
};
