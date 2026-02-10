import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import authValidation from '../validators/auth.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { redirectIfLoggedIn } from "../middlewares/auth.middleware.js";


router.use('/', (req, res, next)=>{
  res.locals.layout = 'layouts/auth.layout.ejs';
  next();
});

router.get('/login', redirectIfLoggedIn, authController.loginPage);
router.post('/login', redirectIfLoggedIn, authValidation.loginValidation, validate, authController.login);

router.get('/register', authController.registerPage);
router.post('/register', redirectIfLoggedIn, authValidation.userValidation, validate, authController.register);

router.get('/forgot-password', authController.forgotPasswordPage);
// router.post('/forgot-password', redirectIfLoggedIn, isValid.forgotPasswordValidation, authController.forgotPassword);

router.get('/reset-password', authController.resetPasswordPage);
// router.post('/reset-password/:token', isValid.resetPasswordValidation, authController.resetPassword);

// Google Login
// router.get('/auth/google',
//     passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google Callback
// router.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     authController.googleCallback
// );

router.get('/logout', authController.logout);

router.get('/verify-email/:token', authController.verifyEmail);


export default router;