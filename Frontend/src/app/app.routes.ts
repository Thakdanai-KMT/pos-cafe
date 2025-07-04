import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { AuthGuard } from './pages/guards/guards.component';

export const routes: Routes = [
  // หน้า Login (อยู่นอก Layout)
  { path: 'login', component: LoginComponent },

  // หน้าอื่นๆ ที่อยู่ภายใต้ Layout (มี Sidebar)
  {
    path: '',
    component: MainLayoutComponent,
        canActivate: [AuthGuard], // ✅ ป้องกันไม่ให้เข้า Layout ถ้าไม่ login

    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'menu', loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent) },
      { path: 'report', loadComponent: () => import('./pages/report/report.component').then(m => m.ReportComponent) },
      { path: 'adminmenu', loadComponent: () => import('./pages/admin-menu/admin-menu.component').then(m => m.AdminMenuComponent) },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // default ภายใต้ layout
    ]
  },

  // default redirect ของ root app
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // catch-all route (optional)
  { path: '**', redirectTo: 'login' }
];
