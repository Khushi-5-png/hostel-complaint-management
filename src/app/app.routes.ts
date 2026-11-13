import { Routes } from '@angular/router';
import { LoginComponent } from './login';
import { ComplaintFormComponent } from './complaint-form';
import { StudentDashboardComponent } from './student-dashboard';
import { AdminDashboardComponent } from './admin-dashboard';
import { HelpComponent } from './help';
import { ResetPasswordComponent } from './reset-password';
import { WardenDashboardComponent } from './warden-dashboard';
import { SuperintendentDashboardComponent } from './superintendent-dashboard';

export const routes: Routes = [
  // 1. The Front Door: Login is now the very first page!
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // 2. Inside: Admin, Warden & Superintendent Portal
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'warden', component: AdminDashboardComponent },
  { path: 'superintendent', component: AdminDashboardComponent },

  // 3. Inside: Student Portal
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'complaint', component: ComplaintFormComponent },

  // 4. Utilities
  { path: 'help', component: HelpComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
];
