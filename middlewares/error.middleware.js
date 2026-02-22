export const pageNotFoundHandler = (req, res, next) => {
    const isApi = req.originalUrl.startsWith('/api');

    // API 404
    if (isApi) {
        return res.status(404).json({
            success: false,
            message: 'Route not found'
        });
    }

    // Web 404
    res.status(404).render('errors/404', {
        title: '404 - Page Not Found',
        message: 'Page Not Found'
    });
};

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Something went wrong';

    const isApi = req.originalUrl.startsWith('/api');

    // API Errors
    if (isApi) {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(err.details && { errors: err.details })
        });
    }

    // Web Errors
    if (err.isOperational) {
        req.flash('error', message);
        return res.redirect(req.get('Referer') || '/');
    }

    console.error(err);
    res.status(500).render('errors/error', {
        title: '500 - Server Error',
        message: 'Something went wrong'
    });
};