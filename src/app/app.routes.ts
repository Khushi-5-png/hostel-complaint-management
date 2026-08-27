import { Routes } from '@angular/router';
import { ComplaintFormComponent } from './complaint-form';
import { WardenDashboardComponent } from './warden-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: ComplaintFormComponent
  },
  {
    path: 'warden',
    component: WardenDashboardComponent
  }
];
