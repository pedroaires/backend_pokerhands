import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET as string;

export const signAccessToken = (user: any) => {
    return jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
};

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).send({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).send({ message: 'Failed to authenticate token' });
        }
        req.body.userId = (decoded as any).userId;
        next();
    });
};
