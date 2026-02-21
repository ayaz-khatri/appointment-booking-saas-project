import {
    loginUserService,
    registerUserService,
    verifyEmailService,
    forgotPasswordService,
    resetPasswordService
} from '../services/auth.service.js';
import User from '../models/user.model.js';
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();

const loginPage = async (req, res, next) => {
    try {
        res.render('auth/login', { title: `Login - ${process.env.APP_NAME}` });
    } catch (error) {
        next(error);
    }
};

const registerPage = async (req, res, next) => {
    try {
        res.render('auth/register', { title: `Register - ${process.env.APP_NAME}` });
    } catch (error) {
        next(error);
    }
};

const forgotPasswordPage = async (req, res, next) => {
    try {
        res.render('auth/forgot-password', { title: `Forgot Password - ${process.env.APP_NAME}` });
    } catch (error) {
        next(error);
    }
};

const resetPasswordPage = async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            isDeleted: false,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Invalid or expired link.');
            req.flash('old', req.body);
            return res.redirect('/login');
        }

        res.render('auth/reset-password', { token: req.params.token, title: 'Reset Password' });
    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    const { email, password, rememberMe } = req.body;
    try {
        const { user, token } = await loginUserService({ email, password, rememberMe });
        const cookieOptions = { httpOnly: true, sameSite: 'strict' };
        if (rememberMe) {
            cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
        }

        res.cookie('token', token, cookieOptions);
        req.flash('success', 'Login Successful.');

        const redirectMap = {
            admin: '/admin',
            vendor: '/vendor',
            customer: '/'
        };

        res.redirect(redirectMap[user.role] || '/');

    } catch (error) {
        next(error);
    }
};


const register = async (req, res, next) => {
    try {
        await registerUserService(req.body);
        req.flash('success','Registration successful. Please check your email to verify your account.');
        res.redirect('/login');
    } catch (error) {
        next(error);
    }
};

const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
    res.redirect('/login');
};

const verifyEmail = async (req, res, next) => {
    try {
        await verifyEmailService(req.params.token);

        req.flash('success', 'Email verified successfully.');
        res.redirect('/login');

    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        await forgotPasswordService(req.body.email);

        req.flash('success', 'If the email exists, a reset link has been sent.');
        res.redirect('/forgot-password');
    } catch (error) {
        next(error);
    }
};



const resetPassword = async (req, res, next) => {
    try {
        await resetPasswordService(req.params.token, req.body.password);

        req.flash('success', 'Password reset successful. Please log in.');
        res.redirect('/login');

    } catch (error) {
        next(error);
    }
};



export default {
    loginPage,
    registerPage,
    forgotPasswordPage,
    resetPasswordPage,
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout
};