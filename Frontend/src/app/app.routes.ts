import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  // หน้า Login (อยู่นอก Layout)
  { path: 'login', component: LoginComponent },

  // หน้าอื่น ๆ ที่อยู่ภายใต้ Layout (มี Sidebar)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      // { path: 'menu', loadComponent: () => import('./pages/menu.component').then(m => m.MenuComponent) },
      // { path: 'report', loadComponent: () => import('./pages/report.component').then(m => m.ReportComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // default ภายใต้ layout
    ]
  },

  // default redirect ของ root app
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // catch-all route (optional)
  { path: '**', redirectTo: 'login' }
];
