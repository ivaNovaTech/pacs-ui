import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Fixes ngClass, ngFor, ngIf, and DatePipe
import { FormsModule } from '@angular/forms'; // Fixes [(ngModel)]
import { RouterModule, Router } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patient-dashboard.component.html',
  styles: [`
    .font-monospace { font-family: 'SFMono-Regular', Consolas, monospace; }
    .extra-small { font-size: 0.75rem; }
    .table-hover tbody tr:hover { background-color: rgba(13, 110, 253, 0.04); }
    .card { box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); }
    .page-link { cursor: pointer; }
    .badge { font-weight: 500; }
  `]
})
export class PatientDashboardComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  paginatedPatients: Patient[] = [];
  
  // Search and Pagination
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  Math = Math; // Required for Math.min in template

  constructor(private patientService: PatientService, private router: Router) { }

  ngOnInit(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.calculatePagination();
      },
      error: (err) => console.error('Error loading patients:', err)
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(p => 
      p.mrn?.toLowerCase().includes(term) ||
      p.last_name?.toLowerCase().includes(term) ||
      p.first_name?.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPatients.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedPatients = this.filteredPatients.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  viewStudies(patientId: number): void {
    // study.patient_id matches patient.id
    this.router.navigate(['/patients', patientId, 'studies']);
  }
}