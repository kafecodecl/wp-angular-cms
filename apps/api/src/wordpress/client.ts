import { env } from '../config/env.js';
import { WordPressError } from '../lib/errors.js';
import { resolveRestBase } from './rest-base.js';

type QueryValue = string | number | boolean | undefined;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, QueryValue>;
  body?: unknown;
  auth?: boolean;
  timeoutMs?: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: Headers;
}

export class WordPressClient {
  private readonly baseUrl: string;
  private readonly authHeader: string | null;

  constructor() {
    if (!env.WP_URL) {
      throw new Error('WP_URL no esta configurada');
    }

    this.baseUrl = env.WP_URL.replace(/\/$/, '');
    this.authHeader =
      env.WP_USER && env.WP_APP_PASSWORD
        ? `Basic ${Buffer.from(`${env.WP_USER}:${env.WP_APP_PASSWORD}`).toString('base64')}`
        : null;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<WordPressResponse<T>> {
    const normalizedPath = path.replace(/^\//, '');
    const restBase = await resolveRestBase();
    const url = new URL(`${this.baseUrl}/${restBase}/${normalizedPath}`);

    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const headers: Record<string, string> = { Accept: 'application/json' };

    if (options.auth && this.authHeader) {
      headers.Authorization = this.authHeader;
    }

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    let response: Response;

    try {
      response = await fetch(url, {
        method: options.method ?? 'GET',
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: AbortSignal.timeout(options.timeoutMs ?? 8000),
      });
    } catch (error) {
      throw new WordPressError(
        'No se pudo conectar con WordPress',
        error instanceof Error ? error.message : error,
      );
    }

    if (!response.ok) {
      const raw = await response.text();
      let message = `WordPress respondio con estado ${response.status}`;
      let details: unknown = raw.slice(0, 500);

      try {
        const parsed = JSON.parse(raw) as { code?: string; message?: string };
        message = parsed.message ?? message;
        details = parsed;
      } catch {
        // La respuesta no es JSON; conservamos el texto plano.
      }

      const statusCode =
        response.status === 401 || response.status === 403 ? response.status : 502;
      const code =
        statusCode === 401
          ? 'UNAUTHORIZED'
          : statusCode === 403
            ? 'FORBIDDEN'
            : 'WORDPRESS_ERROR';

      throw new WordPressError(message, details, statusCode, code);
    }

    const data = (await response.json()) as T;

    return { data, headers: response.headers };
  }
}
