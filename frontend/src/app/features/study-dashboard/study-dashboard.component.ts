import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

export interface Study {
  id: number;          // This is the internal Study ID (e.g., 15)
  patient_id: number;  // This is the internal Patient ID (e.g., 5)
  study_id: number;   
  study_uid: string;  
  study_date: string;
  study_year: number;
  modality: string;
  description: string;
}

@Component({
  selector: 'app-study-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid mt-4 px-4">
      <nav class="mb-3">
        <button class="btn btn-link p-0 text-decoration-none fw-bold" (click)="backToPatients()">
          <i class="bi bi-arrow-left"></i> Back to Patients
        </button>
      </nav>

      <div class="card shadow-sm border-0">
        <div class="card-header bg-dark text-white py-3">
          <h3 class="fw-bold mb-0">Patient Studies</h3>
          <small class="text-info">Patient ID: {{ patientId }}</small>
        </div>

        <div class="card-body p-0">
          <div *ngIf="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>

          <div class="table-responsive" *ngIf="!isLoading && studies.length > 0">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">Date</th>
                  <th>Modality</th>
                  <th>Description</th>
                  <th class="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of studies">
                  <td class="ps-4"><strong>{{ s.study_date }}</strong></td>
                  <td><span class="badge bg-secondary">{{ s.modality }}</span></td>
                  <td>{{ s.description }}</td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-primary" (click)="viewSeries(s.id)">
                      View Series
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div *ngIf="!isLoading && studies.length === 0" class="text-center py-5">
            <p>No studies found for this patient.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudyDashboardComponent implements OnInit {
  studies: Study[] = [];
  patientId: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 1. Grab the patient ID from the URL (/patients/5/studies)
    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.loadStudies(+this.patientId);
    }
  }

  loadStudies(pId: number): void {
    this.isLoading = true;
    const url = `${environment.apiUrl}/api/patients/${pId}/studies`;
    this.http.get<Study[]>(url).subscribe({
      next: (data) => {
        this.studies = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  viewSeries(studyId: number): void {
    // 2. CRITICAL NAVIGATION:
    // This builds the path: /patients/5/studies/15/series
    // Ensure your app.routes.ts has: path: 'patients/:id/studies/:sid/series'
    console.log(`Navigating to Series: /patients/${this.patientId}/studies/${studyId}/series`);
    
    this.router.navigate(['/patients', this.patientId, 'studies', studyId, 'series']);
  }

  backToPatients(): void {
    this.router.navigate(['/patients']);
  }
}