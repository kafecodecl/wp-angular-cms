import { Component, afterNextRender, inject, signal } from '@angular/core';
import type { HealthResponse, WPSiteInfo } from '@cms/shared';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly api = inject(ApiService);

  protected readonly site = signal<WPSiteInfo | null>(null);
  protected readonly health = signal<HealthResponse | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    afterNextRender(() => {
      this.api.getHealth().subscribe({
        next: (health) => this.health.set(health),
        error: () =>
          this.error.set(
            'La API no responde. Inicia apps/api con `npm run dev:api` en el puerto 4001.',
          ),
        complete: () => this.loading.set(false),
      });

      this.api.getSite().subscribe({
        next: (site) => this.site.set(site),
        error: () => {
          this.site.set(null);
        },
      });
    });
  }
}
