import type { Request } from 'express';
import { Router } from 'express';
import { isWordPressConfigured } from '../config/env.js';
import { AppError, ServiceUnavailableError } from '../lib/errors.js';
import type { ListParams } from '../wordpress/service.js';
import { wordpressService } from '../wordpress/service.js';

export const contentRouter = Router();

contentRouter.use((_req, _res, next) => {
  if (!isWordPressConfigured) {
    next(new ServiceUnavailableError());
    return;
  }

  next();
});

function parseNumber(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseString(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  return value.trim();
}

function parseListQuery(query: Request['query']): ListParams {
  return {
    page: parseNumber(query['page']),
    perPage: parseNumber(query['perPage'] ?? query['per_page']),
    search: parseString(query['search']),
    category: parseNumber(query['category']),
    tag: parseNumber(query['tag']),
  };
}

contentRouter.get('/site', async (_req, res) => {
  res.json(await wordpressService.getSite());
});

contentRouter.get('/wp/me', async (_req, res) => {
  res.json(await wordpressService.getCurrentUser());
});

contentRouter.get('/posts', async (req, res) => {
  res.json(await wordpressService.getPosts(parseListQuery(req.query)));
});

contentRouter.get('/posts/:slug', async (req, res) => {
  const post = await wordpressService.getPostBySlug(req.params.slug);

  if (!post) {
    throw new AppError('Post no encontrado', 404, 'POST_NOT_FOUND');
  }

  res.json(post);
});

contentRouter.get('/pages', async (req, res) => {
  res.json(await wordpressService.getPages(parseListQuery(req.query)));
});

contentRouter.get('/pages/:slug', async (req, res) => {
  const page = await wordpressService.getPageBySlug(req.params.slug);

  if (!page) {
    throw new AppError('Pagina no encontrada', 404, 'PAGE_NOT_FOUND');
  }

  res.json(page);
});

contentRouter.get('/media', async (req, res) => {
  res.json(await wordpressService.getMedia(parseListQuery(req.query)));
});

contentRouter.get('/categories', async (req, res) => {
  res.json(await wordpressService.getCategories(parseListQuery(req.query)));
});

contentRouter.get('/tags', async (req, res) => {
  res.json(await wordpressService.getTags(parseListQuery(req.query)));
});
