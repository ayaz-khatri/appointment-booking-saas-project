import { ENV } from '../../config/env.config.js';

const index = async (req, res, next) => {
    try {
        res.render('pages/home', { title: `${ENV.app.name} - Online Booking SaaS`} );
    } catch (error) {
        next(error);
    }
};

export default {
    index
};