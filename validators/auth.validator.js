import {
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  requiredString
} from './common.validator.js';

export const loginValidation = [
  emailValidator(),
  passwordValidator()
];

export const userValidation = [
  requiredString('name', 5, 50),
  emailValidator(),
  requiredString('phone', 5, 20),
  passwordValidator(),
  confirmPasswordValidator()
];

export const forgotPasswordValidation = [
  emailValidator()
];

export const resetPasswordValidation = [
  passwordValidator(),
  confirmPasswordValidator()
];