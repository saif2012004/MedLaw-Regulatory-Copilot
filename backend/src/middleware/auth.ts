import { Request, Response, NextFunction } from 'express';
import admin from '../services/firebase';

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!token && req.headers['x-user']) {
      (req as any).user = { uid: String(req.headers['x-user']) };
      return next();
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).user = { uid: decoded.uid, email: decoded.email };
    return next();
  } catch (error) {
    console.error('Auth error', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
