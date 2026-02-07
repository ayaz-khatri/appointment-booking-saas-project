import { loginUserService } from '../services/auth.service.js';
import errorMessage from "../utils/error-message.util.js";
import dotenv from "dotenv";
dotenv.config();

const loginPage = async (req, res, next) => {
    try {
        res.render('auth/login', { title: `Login - ${process.env.APP_NAME}`} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

const registerPage = async (req, res, next) => {
    try {
        res.render('auth/register', { title: `Register - ${process.env.APP_NAME}`} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

const forgotPasswordPage = async (req, res, next) => {
    try {
        res.render('auth/forgot-password', { title: `Forgot Password - ${process.env.APP_NAME}`} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

const resetPasswordPage = async (req, res, next) => {
    try {
        res.render('auth/reset-password', { title: `Reset Password - ${process.env.APP_NAME}`} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};


const login = async (req, res, next) => {
    const { email, password, rememberMe } = req.body;
    try {
        const { user, token } = await loginUserService({
            email,
            password,
            rememberMe
        });

        const cookieOptions = {
            httpOnly: true,
            sameSite: 'strict'
        };

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
        if (error.message === 'INVALID_CREDENTIALS') {
            req.flash('error', 'Invalid Email or Password.');
            req.flash('old', req.body);
            return res.redirect('/login');
        }

        if (error.message === 'EMAIL_NOT_VERIFIED') {
            req.flash('error', 'Please verify your email first.');
            return res.redirect('/login');
        }

        next(error);
    }
};

const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
    res.redirect('/login');
};

export default {
    loginPage,
    registerPage,
    forgotPasswordPage,
    resetPasswordPage,
    login,
    logout
};