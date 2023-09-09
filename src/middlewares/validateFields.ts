import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { ERROR_MESSAGES } from '../constants/apiMessages';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../constants/httpCodes';

const validateFields = (fieldValidators: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(fieldValidators.map((validator) => validator.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS.ERROR,
        message: ERROR_MESSAGES.BODY_NOT_VALID,
        errors: errors.array(),
      });
    }

    return next();
  };
};

export default validateFields;
