import type { AuthUser, LoginResponse } from '@cms/shared';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';
import { createSessionToken } from '../lib/jwt.js';
import { verifyPassword } from '../lib/password.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: { code: 'RATE_LIMITED', message: 'Demasiados intentos. Espera unos minutos.' },
  },
});

authRouter.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = loginSchema.parse(req.body);

  if (!env.ADMIN_PASSWORD_HASH) {
    throw new AppError('El login no esta configurado', 503, 'AUTH_NOT_CONFIGURED');
  }

  const usernameMatches = username.toLowerCase() === env.ADMIN_USERNAME.toLowerCase();
  const passwordMatches = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);

  if (!usernameMatches || !passwordMatches) {
    throw new AppError('Credenciales invalidas', 401, 'INVALID_CREDENTIALS');
  }

  const user: AuthUser = {
    id: 1,
    username: env.ADMIN_USERNAME,
    displayName: env.ADMIN_DISPLAY_NAME ?? env.ADMIN_USERNAME,
    role: 'administrator',
  };

  const { token, expiresAt } = await createSessionToken(user);

  res.cookie(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });

  const body: LoginResponse = { user, expiresAt: expiresAt.toISOString() };
  res.json(body);
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(env.AUTH_COOKIE_NAME, { path: '/' });
  res.status(204).end();
});

authRouter.get('/me', requireAuth, (_req, res) => {
  res.json(res.locals['user'] as AuthUser);
});
