import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { adminRouter } from './routes/admin.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { contentRouter } from './routes/content.routes.js';
import { healthRouter } from './routes/health.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  app.get('/', (_req, res) => {
    res.json({
      name: 'cms-api',
      version: process.env['npm_package_version'] ?? '0.1.0',
      endpoints: {
        health: '/health',
        authLogin: '/api/auth/login',
        authMe: '/api/auth/me',
        wpMe: '/api/wp/me',
        adminPosts: '/api/admin/posts',
        site: '/api/site',
        posts: '/api/posts',
        pages: '/api/pages',
        media: '/api/media',
        categories: '/api/categories',
        tags: '/api/tags',
      },
    });
  });

  app.use('/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api', contentRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
