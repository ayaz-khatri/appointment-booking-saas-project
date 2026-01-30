import errorMessage from "../utils/error-message.util.js";
import dotenv from "dotenv";
dotenv.config();

const index = async (req, res, next) => {
    try {
        res.render('pages/home', { title: `${process.env.APP_NAME} - Online Booking SaaS`} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

export default {
    index
};