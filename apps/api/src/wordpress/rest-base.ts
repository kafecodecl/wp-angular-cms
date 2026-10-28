import { env } from '../config/env.js';
import { WordPressError } from '../lib/errors.js';

const CANDIDATES = ['wp-json', 'index.php/wp-json'] as const;

let cachedRestBase: string | null = null;

export async function resolveRestBase(): Promise<string> {
  if (cachedRestBase) {
    return cachedRestBase;
  }

  if (env.WP_REST_PATH) {
    cachedRestBase = env.WP_REST_PATH.replace(/^\/+|\/+$/g, '');
    return cachedRestBase;
  }

  if (!env.WP_URL) {
    throw new WordPressError('WP_URL no esta configurada');
  }

  const baseUrl = env.WP_URL.replace(/\/$/, '');
  const errors: string[] = [];

  for (const candidate of CANDIDATES) {
    try {
      const response = await fetch(`${baseUrl}/${candidate}/`, {
        signal: AbortSignal.timeout(4000),
      });

      if (response.ok) {
        cachedRestBase = candidate;
        return candidate;
      }

      errors.push(`${candidate}: HTTP ${response.status}`);
    } catch (error) {
      errors.push(`${candidate}: ${error instanceof Error ? error.message : 'error'}`);
    }
  }

  throw new WordPressError(
    'No se encontro la API REST de WordPress. Configura WP_REST_PATH.',
    errors,
  );
}
