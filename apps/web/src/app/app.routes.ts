import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'CMS Angular',
    loadComponent: () => import('./pages/home/home').then((module) => module.Home),
  },
  {
    path: 'admin/login',
    title: 'Iniciar sesion',
    loadComponent: () => import('./pages/login/login').then((module) => module.Login),
  },
  {
    path: 'admin',
    title: 'Panel',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin-posts').then((module) => module.AdminPosts),
  },
  { path: '**', redirectTo: '' },
];
