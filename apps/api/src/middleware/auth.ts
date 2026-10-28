import type { ApiErrorBody } from '@cms/shared';
import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { verifySessionToken } from '../lib/jwt.js';

export const requireAuth: RequestHandler = async (req, res, next) => {
  const header = req.headers.authorization;
  const bearer = header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : undefined;
  const cookieToken = req.cookies?.[env.AUTH_COOKIE_NAME] as string | undefined;
  const token = cookieToken ?? bearer;

  if (!token) {
    const body: ApiErrorBody = {
      error: { code: 'UNAUTHORIZED', message: 'No autenticado' },
    };

    res.status(401).json(body);
    return;
  }

  const user = await verifySessionToken(token);

  if (!user) {
    const body: ApiErrorBody = {
      error: { code: 'UNAUTHORIZED', message: 'Sesion invalida o expirada' },
    };

    res.status(401).json(body);
    return;
  }

  res.locals['user'] = user;
  next();
};
