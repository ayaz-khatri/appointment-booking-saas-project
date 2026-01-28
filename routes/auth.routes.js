import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';

router.use('/', (req, res, next)=>{
  res.locals.layout = 'layouts/auth.layout.ejs';
  next();
});

router.get('/login', authController.login);
router.get('/register', authController.register);
router.get('/forgot-password', authController.forgotPassword);
router.get('/reset-password', authController.resetPassword);

export default router;