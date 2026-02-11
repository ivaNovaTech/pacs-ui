import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environment/environment';

export interface Study {
  id: number;
  patient_id: number; 
  studyid: string;  
  accn_num: string; 
  study_uid: string;  
  study_date: string;
  study_year: number;
  modality: string;
  description: string;
  mrn: string;
}

@Component({
  selector: 'app-study-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-inventory.component.html'
})
export class StudyInventoryComponent implements OnInit {
  studies: Study[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  isLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  get totalPages(): number {
    return this.totalCount > 0 ? Math.ceil(this.totalCount / this.pageSize) : 1;
  }

  loadData(): void {
    this.isLoading = true;
    const offset = (this.currentPage - 1) * this.pageSize;
    const url = `${environment.apiUrl}/api/studies/?limit=${this.pageSize}&offset=${offset}`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data && data.results) {
          this.studies = data.results;
          this.totalCount = data.count;
        } else {
          this.studies = Array.isArray(data) ? data : [];
          this.totalCount = 0;
        }
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Study Load Error:', err);
        this.isLoading = false;
      }
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.loadData();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.loadData();
  }

  // Matches path: 'patients/:id/studies'
  viewPatient(patientId: number): void {
    this.router.navigate(['/patients', patientId, 'studies']);
  }

  // Matches path: 'patients/:id/studies/:sid/series'
  viewSeries(patientId: number, studyId: number): void {
    this.router.navigate(['/patients', patientId, 'studies', studyId, 'series']);
  }
}