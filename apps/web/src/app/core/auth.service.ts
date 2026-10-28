import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import type { AuthUser, LoginResponse } from '@cms/shared';
import { catchError, map, of, tap } from 'rxjs';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly user = signal<AuthUser | null>(null);

  login(username: string, password: string): Observable<AuthUser> {
    return this.http
      .post<LoginResponse>(
        '/api/auth/login',
        { username, password },
        { withCredentials: true },
      )
      .pipe(
        map((response) => response.user),
        tap((user) => this.user.set(user)),
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>('/api/auth/logout', {}, { withCredentials: true })
      .pipe(tap(() => this.user.set(null)));
  }

  loadSession(): Observable<AuthUser | null> {
    return this.http.get<AuthUser>('/api/auth/me', { withCredentials: true }).pipe(
      tap((user) => this.user.set(user)),
      catchError(() => {
        this.user.set(null);
        return of(null);
      }),
    );
  }
}
