import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../lib/errors.js';
import { requireAuth } from '../middleware/auth.js';
import { wordpressService } from '../wordpress/service.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);

const postStatusSchema = z.enum(['draft', 'publish', 'pending', 'private', 'future']);

const postInputSchema = z.object({
  title: z.string().trim().min(1).max(300),
  content: z.string().default(''),
  status: postStatusSchema.optional(),
  excerpt: z.string().max(2000).optional(),
  slug: z.string().trim().max(200).optional(),
  categories: z.array(z.number().int().positive()).optional(),
  tags: z.array(z.number().int().positive()).optional(),
  featured_media: z.number().int().nonnegative().optional(),
});

const updatePostSchema = postInputSchema.partial();

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  status: z.string().trim().optional(),
});

function parseId(value: string): number {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('ID invalido', 400, 'INVALID_ID');
  }

  return id;
}

adminRouter.get('/posts', async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  res.json(await wordpressService.getAdminPosts(query));
});

adminRouter.get('/posts/:id', async (req, res) => {
  res.json(await wordpressService.getAdminPost(parseId(req.params.id)));
});

adminRouter.post('/posts', async (req, res) => {
  const input = postInputSchema.parse(req.body);
  res.status(201).json(await wordpressService.createPost(input));
});

adminRouter.put('/posts/:id', async (req, res) => {
  const input = updatePostSchema.parse(req.body);
  res.json(await wordpressService.updatePost(parseId(req.params.id), input));
});

adminRouter.delete('/posts/:id', async (req, res) => {
  const force = req.query['force'] === 'true';
  res.json(await wordpressService.deletePost(parseId(req.params.id), force));
});
