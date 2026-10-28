import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import type { PostInput, PostStatus, WPPost } from '@cms/shared';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-posts',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './admin-posts.html',
  styleUrl: './admin-posts.scss',
})
export class AdminPosts {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly user = this.auth.user;
  protected readonly posts = signal<WPPost[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly editingId = signal<number | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: [''],
    excerpt: [''],
    content: [''],
    status: ['draft' as PostStatus],
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.api.adminListPosts(1, 50).subscribe({
      next: (result) => this.posts.set(result.items),
      error: () => {
        this.error.set('No se pudieron cargar los posts');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  protected edit(post: WPPost): void {
    this.editingId.set(post.id);
    this.form.setValue({
      title: post.title.raw ?? post.title.rendered,
      slug: post.slug,
      excerpt: post.excerpt.raw ?? '',
      content: post.content.raw ?? '',
      status: (post.status as PostStatus) ?? 'draft',
    });
  }

  protected newPost(): void {
    this.editingId.set(null);
    this.form.reset({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'draft',
    });
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const value = this.form.getRawValue();
    const payload: PostInput = {
      title: value.title,
      content: value.content,
      status: value.status,
      excerpt: value.excerpt || undefined,
      slug: value.slug || undefined,
    };

    const id = this.editingId();
    const request = id
      ? this.api.adminUpdatePost(id, payload)
      : this.api.adminCreatePost(payload);

    request.subscribe({
      next: () => {
        this.newPost();
        this.load();
      },
      error: () => {
        this.error.set('No se pudo guardar el post');
        this.saving.set(false);
      },
      complete: () => this.saving.set(false),
    });
  }

  protected remove(post: WPPost): void {
    const title = post.title.raw ?? post.title.rendered;

    if (!confirm(`Eliminar "${title}"?`)) {
      return;
    }

    this.api.adminDeletePost(post.id).subscribe({
      next: () => {
        if (this.editingId() === post.id) {
          this.newPost();
        }

        this.load();
      },
      error: () => this.error.set('No se pudo eliminar el post'),
    });
  }

  protected logout(): void {
    this.auth.logout().subscribe({
      next: () => void this.router.navigate(['/admin/login']),
      error: () => void this.router.navigate(['/admin/login']),
    });
  }
}
