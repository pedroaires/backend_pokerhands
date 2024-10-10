// src/errors/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './customErrors';
import { APIError } from './apiError';

export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        return res.status(404).json({ message: err.message });
    }

    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
        // For programming or unknown errors
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    });

};
