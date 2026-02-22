import { validationResult } from 'express-validator';
import { AppError } from '../utils/app-error.util.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join(', ');

    return next(
      new AppError(messages, 422, true)
    );
  }

  next();
};

export default validate;