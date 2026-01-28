import errorMessage from "../utils/error-message.util.js";

const login = async (req, res, next) => {
    try {
        res.render('auth/login', { title: 'Login - Appointify'} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

const register = async (req, res, next) => {
    try {
        res.render('auth/register', { title: 'Register - Appointify'} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        res.render('auth/forgot-password', { title: 'Forgot Password - Appointify'} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        res.render('auth/reset-password', { title: 'Reset Password - Appointify'} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

export default {
    login,
    register,
    forgotPassword,
    resetPassword
};