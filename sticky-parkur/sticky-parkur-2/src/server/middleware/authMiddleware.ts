import { Request, Response, NextFunction } from 'express';
import { AccessCode } from '../models/accessCode.model';
import { getAccessCode } from '../services/accessCode.service';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const accessCode = req.headers['x-access-code'] as string;

    if (!accessCode) {
        return res.status(403).json({ message: 'Access code is required.' });
    }

    try {
        const isValid = await getAccessCode(accessCode);
        if (!isValid) {
            return res.status(403).json({ message: 'Invalid access code.' });
        }

        next();
    } catch (error) {
        console.error('Error validating access code:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};