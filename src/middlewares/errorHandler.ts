import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS, HTTP_STATUS_CODE } from '../constants/httpCodes';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let message = 'Internal Server Error';

  // TODO: IMPLEMENT A BETTER ERROR HANDLING,
  // WITH LOGGERS AND IDINTIFYING OPERATIONAL ERRORS AND PROGRAMMER ERRORS

  if (err.message) {
    message = err.message;
  }

  console.error(err);

  res
    .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
    .json({ status: HTTP_STATUS.ERROR, message });
};
