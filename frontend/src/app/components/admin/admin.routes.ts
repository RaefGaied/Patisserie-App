import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'articles',
    loadComponent: () => import('./article-management/article-management.component').then(m => m.ArticleManagementComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'articles/new',
    loadComponent: () => import('./article-form/article-form.component').then(m => m.ArticleFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'articles/:id/edit',
    loadComponent: () => import('./article-form/article-form.component').then(m => m.ArticleFormComponent),
    canActivate: [adminGuard]
  }
];