import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar sesión',
    loadComponent: () => import('./login/login'),
    canActivate: [guestGuard],
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        title: 'Inicio',
        loadComponent: () => import('./pages/home/home'),
      },
      {
        path: 'adocument',
        title: 'Documentos Administrativos',
        loadComponent: () => import('./pages/admin-document/admin-document'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
