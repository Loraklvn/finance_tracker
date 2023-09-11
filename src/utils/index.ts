import { ValidationChain } from 'express-validator';

import { ERROR_MESSAGES } from '../constants/apiMessages';

export const validatePageParams = (
  page?: number,
  pageSize?: number,
): boolean => {
  return !!page && !!pageSize && page >= 1 && pageSize >= 1;
};

export const validateDate = (
  validationChain: ValidationChain,
): ValidationChain => {
  return validationChain
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(ERROR_MESSAGES.DATE_FORMAT_MUST_BE_YYYY_MM_DD);
};
