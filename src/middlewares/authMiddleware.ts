import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../@types/userType';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: 'Token not provided!' });
  }

  const [, token] = authToken.split(' ');

  try {
    jwt.verify(token, String(process.env.JWT_SECRET_KEY), (err, decoded) => {
      if (err) {
        throw new Error();
      }

      req.user = decoded as User;
    });
  } catch (error) {
    return res.status(401).json({ message: 'Inválid access token!' });
  }

  return next();
}
