export interface WPRendered {
  rendered: string;
  raw?: string;
  protected?: boolean;
}

export interface AuthUser {
  id: number;
  username: string;
  displayName: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  expiresAt: string;
}

export type PostStatus = 'draft' | 'publish' | 'pending' | 'private' | 'future';

export interface PostInput {
  title: string;
  content: string;
  status?: PostStatus;
  excerpt?: string;
  slug?: string;
  categories?: number[];
  tags?: number[];
  featured_media?: number;
}

export interface DeletePostResponse {
  deleted: boolean;
  previous?: WPPost;
}

export interface WPSiteInfo {
  name: string;
  description: string;
  url: string;
  home: string;
  gmt_offset: number;
  timezone_string: string;
  namespaces: string[];
}

export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
}

export interface WPPage extends Omit<WPPost, 'categories' | 'tags'> {
  parent: number;
  menu_order: number;
}

export interface WPMediaSize {
  source_url: string;
  width: number;
  height: number;
  mime_type: string;
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: WPRendered;
  source_url: string;
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: Record<string, WPMediaSize>;
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  count: number;
  description: string;
  parent: number;
}

export interface WPUser {
  id: number;
  name: string;
  slug: string;
  description: string;
  link: string;
  url: string;
  roles: string[];
  capabilities: Record<string, boolean>;
  avatar_urls: Record<string, string>;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ServiceStatus {
  configured: boolean;
  reachable: boolean;
  latencyMs: number | null;
  error?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    wordpress: ServiceStatus & { url: string | null };
    redis: { configured: boolean };
  };
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
