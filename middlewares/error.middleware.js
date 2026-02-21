export const flashErrorHandler = (err, req, res, next) => {
    // Default values
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Something went wrong';

    if (err.isOperational) {
        // Operational error → show flash message
        req.flash('error', message);
        return res.redirect(req.get('Referer') || '/');
    }

    // Programming/unexpected error → log and show 500 page
    console.error(err);
    res.status(statusCode).render('errors/error', { error: err, title: `500 - ${message}` });
};