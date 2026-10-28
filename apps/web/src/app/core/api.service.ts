import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type {
  DeletePostResponse,
  HealthResponse,
  Paginated,
  PostInput,
  WPPage,
  WPPost,
  WPSiteInfo,
} from '@cms/shared';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>('/health');
  }

  getSite(): Observable<WPSiteInfo> {
    return this.http.get<WPSiteInfo>(`${this.baseUrl}/site`);
  }

  getPosts(page = 1, perPage = 10): Observable<Paginated<WPPost>> {
    return this.http.get<Paginated<WPPost>>(`${this.baseUrl}/posts`, {
      params: { page, perPage },
    });
  }

  getPost(slug: string): Observable<WPPost> {
    return this.http.get<WPPost>(`${this.baseUrl}/posts/${slug}`);
  }

  getPages(page = 1, perPage = 10): Observable<Paginated<WPPage>> {
    return this.http.get<Paginated<WPPage>>(`${this.baseUrl}/pages`, {
      params: { page, perPage },
    });
  }

  adminListPosts(page = 1, perPage = 20): Observable<Paginated<WPPost>> {
    return this.http.get<Paginated<WPPost>>(`${this.baseUrl}/admin/posts`, {
      params: { page, perPage },
      withCredentials: true,
    });
  }

  adminGetPost(id: number): Observable<WPPost> {
    return this.http.get<WPPost>(`${this.baseUrl}/admin/posts/${id}`, {
      withCredentials: true,
    });
  }

  adminCreatePost(input: PostInput): Observable<WPPost> {
    return this.http.post<WPPost>(`${this.baseUrl}/admin/posts`, input, {
      withCredentials: true,
    });
  }

  adminUpdatePost(id: number, input: Partial<PostInput>): Observable<WPPost> {
    return this.http.put<WPPost>(`${this.baseUrl}/admin/posts/${id}`, input, {
      withCredentials: true,
    });
  }

  adminDeletePost(id: number): Observable<DeletePostResponse> {
    return this.http.delete<DeletePostResponse>(`${this.baseUrl}/admin/posts/${id}`, {
      withCredentials: true,
    });
  }
}
