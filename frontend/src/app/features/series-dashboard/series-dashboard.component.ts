import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { ImageDashboardComponent } from '../image-dashboard/image-dashboard.component';

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
  imports: [CommonModule, RouterModule, ImageDashboardComponent],
  template: `
    <div class="container-fluid mt-4 px-4">
      <nav class="mb-3">
        <button class="btn btn-link p-0 text-decoration-none fw-bold" (click)="backToStudies()">
          <i class="bi bi-arrow-left"></i> Back to Patient Studies
        </button>
      </nav>

      <div class="viewer-wrapper mb-4" *ngIf="selectedSeriesId && patientId && studyId">
        <div class="card shadow-lg bg-dark text-white">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">DICOM Viewer - Series #{{ selectedSeriesNumber }}</h5>
            <button class="btn btn-sm btn-outline-light" (click)="closeViewer()">Close Viewer</button>
          </div>
          <div class="card-body p-0">
            <app-image-dashboard 
              [patientId]="patientId" 
              [studyId]="studyId" 
              [seriesId]="selectedSeriesId">
            </app-image-dashboard>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0" *ngIf="!selectedSeriesId">
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
                    <button class="btn btn-sm btn-dark" (click)="openViewer(s)">
                      View Images
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="!isLoading && seriesList.length === 0" class="text-center py-5 text-muted">
            <div class="alert alert-warning d-inline-block">
              No series found.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viewer-wrapper { min-height: 600px; }
  `]
})
export class SeriesDashboardComponent implements OnInit {
  seriesList: Series[] = [];
  isLoading: boolean = true;
  apiUrl = environment.apiUrl;

  // FIX: Changed from 'string | null' to 'string | undefined'
  patientId: string | undefined;
  studyId: string | undefined;

  selectedSeriesId?: number;
  selectedSeriesNumber?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // FIX: Using '?? undefined' to convert nulls from the route
    this.patientId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.studyId = this.route.snapshot.paramMap.get('sid') ?? undefined;

    if (this.patientId && this.studyId) {
      this.loadSeries(this.patientId, this.studyId);
    } else {
      this.isLoading = false;
    }
  }

  loadSeries(pId: string, sId: string): void {
    this.isLoading = true;
    const url = `${this.apiUrl}/api/patients/${pId}/studies/${sId}/series`;
    this.http.get<Series[]>(url).subscribe({
      next: (data) => {
        this.seriesList = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openViewer(series: Series): void {
    this.selectedSeriesId = series.id;
    this.selectedSeriesNumber = series.series_number;
  }

  closeViewer(): void {
    this.selectedSeriesId = undefined;
    this.selectedSeriesNumber = undefined;
  }

  backToStudies(): void {
    this.router.navigate(['/patients', this.patientId, 'studies']);
  }
}