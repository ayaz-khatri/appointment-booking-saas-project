import dotenv from "dotenv";
dotenv.config();

const index = async (req, res, next) => {
    try {
        res.render('pages/home', { title: `${process.env.APP_NAME} - Online Booking SaaS`} );
    } catch (error) {
        next(error);
    }
};

export default {
    index
};