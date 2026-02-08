import { Routes } from '@angular/router';
import { PatientDashboardComponent } from './features/patient-dashboard/patient-dashboard.component';

export const routes: Routes = [
  // This says: If the path is empty (homepage), show the Dashboard
  { path: '', component: PatientDashboardComponent }, 
];