import { Routes } from '@angular/router';
import { PatientDashboardComponent } from './features/patient-dashboard/patient-dashboard.component';
import { StudyDashboardComponent } from './features/study-dashboard/study-dashboard.component';
import { SeriesDashboardComponent } from './features/series-dashboard/series-dashboard.component';
import { ImageDashboardComponent } from './features/image-dashboard/image-dashboard.component';

export const routes: Routes = [
  // 1. Redirect empty path to patients
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  
  //base route for the patient list
  { path: 'patients', component: PatientDashboardComponent },

  // 3. The drill-down routes (studies, series, patients)
  { path: 'patients/:id/studies', component: StudyDashboardComponent },
  { path: 'patients/:id/studies/:sid/series', component: SeriesDashboardComponent },
  { path: 'patients/:id/studies/:sid/series/:serid/images', component: ImageDashboardComponent },

  // 4. Wildcard route to catch typos and send users back to the start
  { path: '**', redirectTo: 'patients' }
];