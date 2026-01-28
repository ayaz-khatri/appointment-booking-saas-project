const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.redirect('/login');
};

export default isAdmin;
