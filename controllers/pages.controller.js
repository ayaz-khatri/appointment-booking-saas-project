import errorMessage from "../utils/error-message.util.js";

const index = async (req, res, next) => {
    try {
        res.render('pages/home', { title: 'Appointify - Online Booking SaaS'} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

export default {
    index
};