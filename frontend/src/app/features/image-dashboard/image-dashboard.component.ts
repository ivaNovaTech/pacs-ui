import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

export interface Image {
  id: number;
  series_id: number;
  study_id?: number;
  image_uid: string;
  instance_number?: number;
  image_position?: number;
  rows?: number;
  columns?: number;
  transfer_syntax_uid: string;
  study_year?: number;
  modality?: string;
  created_at?: string;
  last_updated_at?: string;
}

@Component({
  selector: 'app-image-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid mt-4 px-4">
      <nav class="mb-3">
        <button class="btn btn-link p-0 text-decoration-none fw-bold" (click)="backToSeries()">
          <i class="bi bi-arrow-left"></i> Back to Series
        </button>
      </nav>

      <div class="card shadow-sm border-0">
        <div class="card-header bg-dark text-white py-3">
          <h3 class="fw-bold mb-0">Image Browser</h3>
          <small class="text-muted">Series ID: {{ seriesId }}</small>
        </div>

        <div class="card-body p-4">
          <div *ngIf="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Retrieving image metadata...</p>
          </div>

          <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4" *ngIf="!isLoading">
            <div class="col" *ngFor="let img of images">
              <div class="card h-100 border-secondary bg-light">
                <div class="card-body">
                  <h6 class="card-title fw-bold">Instance #{{ img.instance_number || 'N/A' }}</h6>
                  <p class="card-text small mb-1">
                    <strong>Resolution:</strong> {{ img.rows }} x {{ img.columns }}
                  </p>
                  <p class="card-text small text-truncate" title="{{ img.image_uid }}">
                    <strong>UID:</strong> {{ img.image_uid }}
                  </p>
                  <p class="card-text mb-0"><span class="badge bg-dark">{{ img.modality }}</span></p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                  <button class="btn btn-sm btn-outline-primary w-100">View DICOM</button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="!isLoading && images.length === 0" class="text-center py-5">
            <div class="alert alert-info">No images found for this series.</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImageDashboardComponent implements OnInit {
  images: Image[] = [];
  patientId: string | null = null;
  studyId: string | null = null;
  seriesId: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Collect all IDs from the route params
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.studyId = this.route.snapshot.paramMap.get('sid');
    this.seriesId = this.route.snapshot.paramMap.get('serid');

    if (this.patientId && this.studyId && this.seriesId) {
      this.loadImages(+this.patientId, +this.studyId, +this.seriesId);
    }
  }

  loadImages(pId: number, sId: number, serId: number): void {
    this.isLoading = true;
    // FULL NESTED PATH: /api/patients/{pId}/studies/{sId}/series/{serId}/images
    const url = `${environment.apiUrl}/api/patients/${pId}/studies/${sId}/series/${serId}/images`;

    this.http.get<Image[]>(url).subscribe({
      next: (data) => {
        this.images = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Image API Load Failed:', err);
        this.isLoading = false;
      }
    });
  }

  backToSeries(): void {
    this.router.navigate(['/patients', this.patientId, 'studies', this.studyId, 'series']);
  }
}