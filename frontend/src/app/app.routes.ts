/*import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ArticleManagementComponent } from './components/admin/article-management/article-management.component';
import { ArticleFormComponent } from './components/admin/article-form/article-form.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'articles', pathMatch: 'full' },
      { path: 'articles', component: ArticleManagementComponent },
      { path: 'articles/new', component: ArticleFormComponent },
      { path: 'articles/:id/edit', component: ArticleFormComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];*/


import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ArticleManagementComponent } from './components/admin/article-management/article-management.component';
import { ArticleFormComponent } from './components/admin/article-form/article-form.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent, // Ajout du composant parent
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'articles', component: ArticleManagementComponent },
      { path: 'articles/new', component: ArticleFormComponent },
      { path: 'articles/:id/edit', component: ArticleFormComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
