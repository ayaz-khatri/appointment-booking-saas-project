import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import session from "express-session";
import flash from "connect-flash";
import path from 'path';
import __dirname from './utils/dirname.util.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import pagesRoutes from './routes/pages.routes.js';
import { attachAuthUser } from "./middlewares/auth.middleware.js";
import { globalErrorHandler, pageNotFoundHandler } from './middlewares/error.middleware.js';
import passport from 'passport';
// import './config/passport.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

/* ------------------------- Initialize Express App ------------------------- */
const app = express();

/* ------------------------------- Middlewares ------------------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressLayouts);
app.set('layout', './layouts/pages.layout.ejs');
app.set('view engine', 'ejs');
app.use(attachAuthUser);

/* --------------------------- Database Connection -------------------------- */
connectDB();

/* ---------------------------- Session Settings ---------------------------- */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

/* ------------------------------ connect-flash ----------------------------- */
app.use(flash());

// Make flash available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.old = req.flash("old")[0] || {};
    next();
});

/* -------------------------------- passport -------------------------------- */
// app.use(passport.initialize());
// app.use(passport.session());

/* --------------------------------- Routes --------------------------------- */
app.use('/', pagesRoutes);
app.use('/admin', adminRoutes);
app.use(authRoutes);

/* ----------------------- Error Handling Middlewares ----------------------- */
app.use(pageNotFoundHandler);
app.use(globalErrorHandler);

/* ---------------------------- Start the server ---------------------------- */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});