import { body } from 'express-validator';

// Email Validator
export const emailValidator = (field = 'email') =>
  body(field)
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.');

// Password Validator
export const passwordValidator = (field = 'password') =>
  body(field)
    .trim()
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be at least 8 and at most 20 characters long.');

// Confirm Password Validator
export const confirmPasswordValidator = (
  confirmField = 'confirmPassword',
  passwordField = 'password'
) =>
  body(confirmField)
    .trim()
    .notEmpty().withMessage('Confirm password is required.')
    .isLength({ min: 8, max: 20 })
    .withMessage('Confirm password must be at least 8 and at most 20 characters long.')
    .custom((value, { req }) => {
      if (value !== req.body[passwordField]) {
        throw new Error('Passwords do not match.');
      }
      return true;
    });

// Required String Validator (Reusable)
export const requiredString = (field, min = 1, max = 100) =>
  body(field)
    .trim()
    .notEmpty().withMessage(`${field} is required.`)
    .isLength({ min, max })
    .withMessage(
      `${field} must be at least ${min} and at most ${max} characters long.`
    );