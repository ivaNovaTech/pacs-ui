import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

export interface Series {
  id: number;
  study_id: number;
  series_uid: string;
  series_number: number;
  modality: string;
  description?: string;
  body_part_examined?: string;
  instance_count: number;
  created_at: string;
}

@Component({
  selector: 'app-series-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid mt-4 px-4">
      <nav class="mb-3">
        <button class="btn btn-link p-0 text-decoration-none fw-bold" (click)="backToStudies()">
          <i class="bi bi-arrow-left"></i> Back to Patient Studies
        </button>
      </nav>

      <div class="card shadow-sm border-0">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="fw-bold mb-0">Series Inventory</h3>
          <div class="small">
            Path: Patients/{{ patientId }}/Studies/{{ studyId }}
          </div>
        </div>

        <div class="card-body p-0">
          <div *ngIf="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Requesting nested series data...</p>
          </div>

          <div class="table-responsive" *ngIf="!isLoading && seriesList.length > 0">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">Series #</th>
                  <th>Modality</th>
                  <th>Body Part</th>
                  <th>Series UID</th>
                  <th class="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of seriesList">
                  <td class="ps-4 fw-bold">{{ s.series_number }}</td>
                  <td><span class="badge bg-info text-dark">{{ s.modality }}</span></td>
                  <td>{{ s.body_part_examined || 'N/A' }}</td>
                  <td>{{ s.series_uid }}</td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-dark" (click)="viewImages(s.id)">
                      View Images
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="!isLoading && seriesList.length === 0" class="text-center py-5 text-muted">
            <div class="alert alert-warning d-inline-block">
              No series found at: <br>
              <code class="small">{{ apiUrl }}/api/patients/{{ patientId }}/studies/{{ studyId }}/series</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SeriesDashboardComponent implements OnInit {
  seriesList: Series[] = [];
  patientId: string | null = null;
  studyId: string | null = null;
  isLoading: boolean = true;
  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // We get these from the route: /patients/:id/studies/:sid/series
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.studyId = this.route.snapshot.paramMap.get('sid');

    if (this.patientId && this.studyId) {
      this.loadSeries(this.patientId, this.studyId);
    } else {
      console.error('CRITICAL: Route parameters missing. Check app.routes.ts');
      this.isLoading = false;
    }
  }

  loadSeries(pId: string, sId: string): void {
    this.isLoading = true;
    
    // FORCING the full nested path you provided
    const url = `${this.apiUrl}/api/patients/${pId}/studies/${sId}/series`;
    
    console.log('Fetching from URL:', url);

    this.http.get<Series[]>(url).subscribe({
      next: (data) => {
        this.seriesList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API 404/500 - Verification failed for:', url, err);
        this.isLoading = false;
      }
    });
  }

  viewImages(seriesId: number): void {
    this.router.navigate(['/patients', this.patientId, 'studies', this.studyId, 'series', seriesId, 'images']);
  }

  backToStudies(): void {
    this.router.navigate(['/patients', this.patientId, 'studies']);
  }
}