import type {
  DeletePostResponse,
  Paginated,
  PostInput,
  ServiceStatus,
  WPMedia,
  WPPage,
  WPPost,
  WPSiteInfo,
  WPTerm,
  WPUser,
} from '@cms/shared';
import { env, isWordPressConfigured } from '../config/env.js';
import { WordPressClient } from './client.js';
import { resolveRestBase } from './rest-base.js';

export interface ListParams {
  page?: number;
  perPage?: number;
  search?: string;
  category?: number;
  tag?: number;
}

const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

function normalizeListParams(params: ListParams): ListParams {
  return {
    page: params.page && params.page > 0 ? params.page : 1,
    perPage: Math.min(params.perPage && params.perPage > 0 ? params.perPage : DEFAULT_PER_PAGE, MAX_PER_PAGE),
    search: params.search,
    category: params.category,
    tag: params.tag,
  };
}

function toPaginated<T>(items: T[], headers: Headers, params: ListParams): Paginated<T> {
  return {
    items,
    page: params.page ?? 1,
    perPage: params.perPage ?? DEFAULT_PER_PAGE,
    total: Number(headers.get('x-wp-total') ?? items.length),
    totalPages: Number(headers.get('x-wp-totalpages') ?? 1),
  };
}

let client: WordPressClient | null = null;

function getClient(): WordPressClient {
  client ??= new WordPressClient();
  return client;
}

export class WordPressService {
  async getSite(): Promise<WPSiteInfo> {
    const { data } = await getClient().request<WPSiteInfo>('');
    return data;
  }

  async getCurrentUser(): Promise<WPUser> {
    const { data } = await getClient().request<WPUser>('wp/v2/users/me', {
      auth: true,
      query: { context: 'edit' },
    });

    return data;
  }

  async getAdminPosts(params: ListParams & { status?: string }): Promise<Paginated<WPPost>> {
    const normalized = normalizeListParams(params);
    const { data, headers } = await getClient().request<WPPost[]>('wp/v2/posts', {
      auth: true,
      query: {
        context: 'edit',
        status: params.status ?? 'any',
        page: normalized.page,
        per_page: normalized.perPage,
        search: normalized.search,
        orderby: 'date',
        order: 'desc',
      },
    });

    return toPaginated(data, headers, normalized);
  }

  async getAdminPost(id: number): Promise<WPPost> {
    const { data } = await getClient().request<WPPost>(`wp/v2/posts/${id}`, {
      auth: true,
      query: { context: 'edit' },
    });

    return data;
  }

  async createPost(input: PostInput): Promise<WPPost> {
    const { data } = await getClient().request<WPPost>('wp/v2/posts', {
      method: 'POST',
      auth: true,
      body: input,
    });

    return data;
  }

  async updatePost(id: number, input: Partial<PostInput>): Promise<WPPost> {
    const { data } = await getClient().request<WPPost>(`wp/v2/posts/${id}`, {
      method: 'POST',
      auth: true,
      body: input,
    });

    return data;
  }

  async deletePost(id: number, force = false): Promise<DeletePostResponse> {
    const { data } = await getClient().request<DeletePostResponse>(`wp/v2/posts/${id}`, {
      method: 'DELETE',
      auth: true,
      query: { force },
    });

    return data;
  }

  async getPosts(params: ListParams = {}): Promise<Paginated<WPPost>> {
    const normalized = normalizeListParams(params);
    const { data, headers } = await getClient().request<WPPost[]>('wp/v2/posts', {
      query: {
        _embed: true,
        page: normalized.page,
        per_page: normalized.perPage,
        search: normalized.search,
        categories: normalized.category,
        tags: normalized.tag,
      },
    });

    return toPaginated(data, headers, normalized);
  }

  async getPostBySlug(slug: string): Promise<WPPost | null> {
    const { data } = await getClient().request<WPPost[]>('wp/v2/posts', {
      query: { slug, _embed: true, per_page: 1 },
    });

    return data[0] ?? null;
  }

  async getPages(params: ListParams = {}): Promise<Paginated<WPPage>> {
    const normalized = normalizeListParams(params);
    const { data, headers } = await getClient().request<WPPage[]>('wp/v2/pages', {
      query: {
        _embed: true,
        page: normalized.page,
        per_page: normalized.perPage,
        search: normalized.search,
      },
    });

    return toPaginated(data, headers, normalized);
  }

  async getPageBySlug(slug: string): Promise<WPPage | null> {
    const { data } = await getClient().request<WPPage[]>('wp/v2/pages', {
      query: { slug, _embed: true, per_page: 1 },
    });

    return data[0] ?? null;
  }

  async getMedia(params: ListParams = {}): Promise<Paginated<WPMedia>> {
    const normalized = normalizeListParams(params);
    const { data, headers } = await getClient().request<WPMedia[]>('wp/v2/media', {
      query: {
        page: normalized.page,
        per_page: normalized.perPage,
        search: normalized.search,
      },
    });

    return toPaginated(data, headers, normalized);
  }

  async getCategories(params: ListParams = {}): Promise<Paginated<WPTerm>> {
    const normalized = normalizeListParams(params);
    const { data, headers } = await getClient().request<WPTerm[]>('wp/v2/categories', {
      query: {
        page: normalized.page,
        per_page: normalized.perPage,
        search: normalized.search,
      },
    });

    return toPaginated(data, headers, normalized);
  }

  async getTags(params: ListParams = {}): Promise<Paginated<WPTerm>> {
    const normalized = normalizeListParams(params);
    const { data, headers } = await getClient().request<WPTerm[]>('wp/v2/tags', {
      query: {
        page: normalized.page,
        per_page: normalized.perPage,
        search: normalized.search,
      },
    });

    return toPaginated(data, headers, normalized);
  }
}

export const wordpressService = new WordPressService();

export async function checkWordPress(): Promise<ServiceStatus & { url: string | null }> {
  if (!isWordPressConfigured || !env.WP_URL) {
    return { configured: false, reachable: false, latencyMs: null, url: null };
  }

  const startedAt = performance.now();

  try {
    const baseUrl = env.WP_URL.replace(/\/$/, '');
    const restBase = await resolveRestBase();
    const response = await fetch(`${baseUrl}/${restBase}/`, {
      signal: AbortSignal.timeout(4000),
    });

    const latencyMs = Math.round(performance.now() - startedAt);

    if (!response.ok) {
      return {
        configured: true,
        reachable: false,
        latencyMs,
        url: env.WP_URL,
        error: `HTTP ${response.status}`,
      };
    }

    return { configured: true, reachable: true, latencyMs, url: env.WP_URL };
  } catch (error) {
    return {
      configured: true,
      reachable: false,
      latencyMs: null,
      url: env.WP_URL,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
