import { Routes } from '@angular/router';
import { ComplaintFormComponent } from './complaint-form';
import { WardenDashboardComponent } from './warden-dashboard';
import { LoginComponent } from './login';
import { SuperintendentDashboardComponent } from './superintendent-dashboard';
import { HelpComponent } from './help';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'help',
    component: HelpComponent
  },
  {
    path: '',
    component: ComplaintFormComponent
  },
  {
    path: 'warden',
    component: WardenDashboardComponent
  },
  {
    path: 'superintendent',
    component: SuperintendentDashboardComponent
  }
];
