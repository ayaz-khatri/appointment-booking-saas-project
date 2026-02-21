export class AppError extends Error {
    constructor(message, statusCode = 400, isOperational = false, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}