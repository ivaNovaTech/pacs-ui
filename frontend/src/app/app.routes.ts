import { Routes } from '@angular/router';
import { PatientDashboardComponent } from './features/patient-dashboard/patient-dashboard.component';
import { StudyDashboardComponent } from './features/study-dashboard/study-dashboard.component';
import { SeriesDashboardComponent } from './features/series-dashboard/series-dashboard.component';
import { ImageDashboardComponent } from './features/image-dashboard/image-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patients', component: PatientDashboardComponent },
  { path: 'patients/:mrn/studies', component: StudyDashboardComponent },
  { path: 'studies/:studyUid/series', component: SeriesDashboardComponent },
  { path: 'series/:seriesUid/images', component: ImageDashboardComponent }, // This matches your [routerLink]
];