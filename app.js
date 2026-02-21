import express from 'express';
import mongoose from 'mongoose';
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
import { flashErrorHandler } from './middlewares/error.middleware.js';
import bodyParser from 'body-parser';
import passport from 'passport';
// import './config/passport.js';
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
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Database Connected."))
.catch(err => console.log(err));

/* ------------------------------ connect-flash ----------------------------- */
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

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


app.use('/admin', (req, res, next)=>{
  res.locals.layout = 'layouts/admin.layout.ejs';
  next();
});

app.use('/', pagesRoutes);
app.use('/admin', adminRoutes);
// app.use('/profile', profileRoutes);


app.use(authRoutes);

app.use('', (req, res, next) => {
    res.status(404).render('errors/404',{
        title: '404 - Page Not Found',
        message: 'Page Not Found'
    });
});

app.use(flashErrorHandler);
// // Error Handling Middleware
// app.use('',(err, req, res, next) => {
//     console.log(err.stack);
//     const status = err.status || 500;
//     res.status(status).render('common/error',{
//         status: status,
//         message: err.message || 'Something went wrong!',
//         role: req.role
//     });
// });

/* ---------------------------- Start the server ---------------------------- */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});