import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
        const user = await User.findOne({ email, isDeleted: false }).select('+password');
        if (!user) {
            req.flash("error", "Invalid Email or Password.");
            req.flash("old", req.body);
            return res.redirect("/login");
        }

        if (!user.isEmailVerified) {
            req.flash('error', 'Please verify your email first.');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash("error", "Invalid Email or Password.");
            req.flash("old", req.body);
            return res.redirect("/login");
        }

        const tokenExpiry = rememberMe ? '30d' : '1d';
        const jwtData = { id: user._id, role: user.role };
        const token = jwt.sign(jwtData, process.env.JWT_SECRET, { expiresIn: tokenExpiry });
        const cookieOptions = { httpOnly: true, sameSite: 'strict' };
        if (rememberMe) cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        res.cookie('token', token, cookieOptions);
 
        req.flash("success", "Login Successful.");
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        const redirectMap = {
            admin: "/admin",
            vendor: "/vendor",
            customer: "/"
        };

        res.redirect(redirectMap[user.role] || "/");

    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

export default {
    loginPage,
    registerPage,
    forgotPasswordPage,
    resetPasswordPage,
    login
};