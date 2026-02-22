
const index = async (req, res, next) => {
    try {
        res.render('admin/dashboard', { title: 'Admin Dashboard'} );
    } catch (error) {
        next(error);
    }
};

export default {
    index
};