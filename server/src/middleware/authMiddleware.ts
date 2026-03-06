import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

interface DecodedToken {
    userId: string;
    iat: number;
    exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            // Decodify token and get user from it
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

            // Search user by ID and attach to req.user, excluding password and sensitive fields
            // Exclude password and other sensitive fields
            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user) {
                res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
                return;
            }

            req.user = user;
            next(); 
        } catch (error) {
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    } else {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

// Middleware for admin-only routes
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: Se requiere rol de Administrador' });
    }
};

// @desc    Auth middleware to check if user has one of the allowed roles
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Verify that user is authenticated and has a role
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ 
                message: `El rol '${req.user?.role}' no tiene permisos para acceder a este recurso` 
            });
            return;
        }
        next();
    };
};