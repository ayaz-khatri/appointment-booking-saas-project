import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ENV } from '../config/env.config.js';

export const attachAuthUser = async (req, res, next) => {
     const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, ENV.jwt.secret);
            const user = await User.findById(decoded.id);
            if(!user || user.isDeleted){
                res.clearCookie('token'); 
                return next(); 
            }
            req.user = user;
            res.locals.isLoggedIn = true;
            res.locals.authUser = user;
        } catch (err) {
            res.locals.isLoggedIn = false;
        }
    } else {
        res.locals.authUser = null;
        res.locals.isLoggedIn = false;
    }

    next();
};

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            req.flash("error", "Unauthorized access. Please log in.");
            return res.redirect("/login");
        }
        next();
    } catch (error) {
        req.flash("error", "Something went wrong. Please log in again.");
        return res.redirect('/login');
    }
}; 

export const isAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.redirect('/login');
};

export const redirectIfLoggedIn = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return next(); // Not logged in → allow access (login/register pages)
    }

    try {
        const decoded = jwt.verify(token, ENV.jwt.secret);

        const redirectMap = {
            admin: "/admin",
            vendor: "/vendor",
            customer: "/"
        };

        return res.redirect(redirectMap[decoded.role] || "/");
    } catch (err) {
        return next(); // Invalid or expired token → treat as not logged in
    }
};