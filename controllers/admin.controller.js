import errorMessage from "../utils/error-message.util.js";

const index = async (req, res, next) => {
    try {
        res.render('admin/dashboard', { title: 'Admin Dashboard'} );
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
};

export default {
    index
};