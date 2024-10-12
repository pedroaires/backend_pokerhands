// src/errors/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { UserError } from './userError';
import { APIError } from './apiError';

export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof UserError) {
        return res.status(err.statusCode).json({ message: err.message });
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
        message: 'Internal Server Error',
    });

};