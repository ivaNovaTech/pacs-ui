import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

// We use the global variables set up in main.ts
declare var cornerstone: any;
declare var cornerstoneWADOImageLoader: any;

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
  image_url?: string; 
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
        <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
          <div>
            <h3 class="fw-bold mb-0">Image Browser</h3>
            <small class="text-muted text-uppercase">Series: {{ seriesId }}</small>
          </div>
          <span class="badge bg-secondary">{{ images.length }} Instances</span>
        </div>

        <div class="card-body p-4 text-center">
          <div *ngIf="isLoading" class="py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Retrieving image metadata...</p>
          </div>

          <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 text-start" *ngIf="!isLoading">
            <div class="col" *ngFor="let img of images">
              <div class="card h-100 border-secondary bg-light shadow-sm">
                <div class="card-body">
                  <h6 class="card-title fw-bold text-primary">Instance #{{ img.instance_number || 'N/A' }}</h6>
                  <p class="card-text small mb-1">
                    <strong>Resolution:</strong> {{ img.rows }} x {{ img.columns }}
                  </p>
                  <p class="card-text small text-truncate" title="{{ img.image_uid }}">
                    <strong>UID:</strong> {{ img.image_uid }}
                  </p>
                  <p class="card-text mb-0"><span class="badge bg-dark">{{ img.modality }}</span></p>
                </div>
                <div class="card-footer bg-white border-top-0">
                  <button class="btn btn-sm btn-primary w-100 fw-bold" (click)="openViewer(img)">
                    <i class="bi bi-eye-fill me-1"></i> View DICOM
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="!isLoading && images.length === 0" class="py-5">
            <div class="alert alert-info border-0 shadow-sm">No images found for this series.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="viewer-overlay" *ngIf="isViewerOpen" (click)="closeViewer()">
      <div class="viewer-card bg-black shadow-lg" (click)="$event.stopPropagation()">
        <div class="d-flex justify-content-between align-items-center p-3 bg-dark text-white border-bottom border-secondary">
          <h5 class="mb-0 fw-bold">{{ selectedImage?.modality }} Viewer</h5>
          <button class="btn-close btn-close-white" (click)="closeViewer()"></button>
        </div>
        
        <div class="viewer-body d-flex justify-content-center align-items-center bg-black">
          <div #dicomCanvas id="dicomElement" style="width:512px;height:512px;position:relative;">
             <div *ngIf="!isImageLoaded" class="text-white text-center position-absolute top-50 start-50 translate-middle">
                <div class="spinner-border spinner-border-sm me-2"></div> Rendering...
             </div>
          </div>
        </div>
        
        <div class="p-2 bg-dark text-muted x-small text-center border-top border-secondary">
          DICOM ID: {{ selectedImage?.image_uid }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viewer-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.92);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .viewer-card {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #444;
    }
    .viewer-body {
      padding: 20px;
      min-width: 552px;
      min-height: 552px;
    }
    .x-small { font-size: 0.7rem; }
  `]
})
export class ImageDashboardComponent implements OnInit {
  @ViewChild('dicomCanvas') dicomElement!: ElementRef;

  images: Image[] = [];
  patientId: string | null = null;
  studyId: string | null = null;
  seriesId: string | null = null;
  isLoading: boolean = true;

  isViewerOpen: boolean = false;
  isImageLoaded: boolean = false;
  selectedImage: Image | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const map = this.route.snapshot.paramMap;
    this.patientId = map.get('id');
    this.studyId = map.get('sid');
    this.seriesId = map.get('serid');

    if (this.patientId && this.studyId && this.seriesId) {
      this.loadImages(+this.patientId, +this.studyId, +this.seriesId);
    }
  }

  loadImages(pId: number, sId: number, serId: number): void {
    this.isLoading = true;
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

  openViewer(img: Image): void {
    if (!img.image_url) {
      alert("Image source (URL) is missing.");
      return;
    }
    this.selectedImage = img;
    this.isViewerOpen = true;
    this.isImageLoaded = false;

    // We must wait for Angular's *ngIf to put the #dicomCanvas into the DOM
    setTimeout(() => {
      this.displayDICOM(img.image_url!);
    }, 150);
  }

  displayDICOM(url: string): void {
    const element = this.dicomElement.nativeElement;
    
    // 1. Setup element for cornerstone
    cornerstone.enable(element);
    
    // 2. Format URL for the WADO loader
    const imageId = `wadouri:${url}`;

    // 3. Request the image
    cornerstone.loadImage(imageId).then((image: any) => {
      this.isImageLoaded = true;
      cornerstone.displayImage(element, image);
      cornerstone.fitToWindow(element);
    }).catch((err: any) => {
      console.error('Cornerstone Load Failed:', err);
    });
  }

  closeViewer(): void {
    this.isViewerOpen = false;
    this.selectedImage = null;
  }

  backToSeries(): void {
    this.router.navigate(['/patients', this.patientId, 'studies', this.studyId, 'series']);
  }
}