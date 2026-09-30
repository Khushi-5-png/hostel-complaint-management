import { Routes } from '@angular/router';
import { ComplaintFormComponent } from './complaint-form';
import { LoginComponent } from './login';
import { StudentDashboardComponent } from './student-dashboard';
import { WardenDashboardComponent } from './warden-dashboard';
import { SuperintendentDashboardComponent } from './superintendent-dashboard';
import { HelpComponent } from './help';
import { ResetPasswordComponent } from './reset-password';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'help', component: HelpComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'warden', component: WardenDashboardComponent },
  { path: 'superintendent', component: SuperintendentDashboardComponent },
  { path: '', component: ComplaintFormComponent, pathMatch: 'full' }
];
