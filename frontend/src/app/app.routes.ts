import { Routes } from '@angular/router';
import { PatientDashboardComponent } from './features/patient-dashboard/patient-dashboard.component';
import { StudyDashboardComponent } from './features/study-dashboard/study-dashboard.component';
import { StudyInventoryComponent } from './features/study-inventory/study-inventory.component';
import { SeriesDashboardComponent } from './features/series-dashboard/series-dashboard.component';
import { ImageDashboardComponent } from './features/image-dashboard/image-dashboard.component';
import { AnalyticsDashboardComponent } from './features/analytics-dashboard.component/analytics-dashboard.component';

export const routes: Routes = [
  { path: '', component: AnalyticsDashboardComponent },
  { path: 'analytics', component: AnalyticsDashboardComponent },
  { path: 'patients', component: PatientDashboardComponent },
  { path: 'studies', component: StudyInventoryComponent },
  // Data Relationships:
  // patient.id -> :id
  // study.id (matches series.study_id) -> :sid
  { path: 'patients/:id/studies', component: StudyDashboardComponent },
  { path: 'patients/:id/studies/:sid/series', component: SeriesDashboardComponent },
  { path: 'patients/:id/studies/:sid/series/:serid/images', component: ImageDashboardComponent },
  { path: '**', redirectTo: '' }
];