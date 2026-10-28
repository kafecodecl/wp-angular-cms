import type { HealthResponse } from '@cms/shared';
import { Router } from 'express';
import { env } from '../config/env.js';
import { checkWordPress } from '../wordpress/service.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const wordpress = await checkWordPress();
  const healthy = !wordpress.configured || wordpress.reachable;

  const body: HealthResponse = {
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    version: process.env['npm_package_version'] ?? '0.1.0',
    services: {
      wordpress,
      redis: { configured: Boolean(env.REDIS_URL) },
    },
  };

  res.status(healthy ? 200 : 503).json(body);
});
