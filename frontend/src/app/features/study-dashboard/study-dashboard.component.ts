import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DicomDataService } from '../../core/services/dicom-data.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-study-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatButtonModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatCardModule
  ],
  templateUrl: './study-dashboard.component.html'
})
export class StudyDashboardComponent implements OnInit {
  studies: any[] = [];
  patientId: string | null = null;
  
  // Columns matching your Study model: study_id, modality, study_date, etc.
  displayedColumns: string[] = [
    'study_id', 
    'study_uid', 
    'modality', 
    'description', 
    'study_date', 
    'actions'
  ];

  constructor(
    private route: ActivatedRoute,
    private dataService: DicomDataService
  ) {}

  ngOnInit(): void {
    // We use 'patientId' because that is the key defined in app.routes.ts
    this.patientId = this.route.snapshot.paramMap.get('patientId');
    
    if (this.patientId) {
      this.loadStudies(this.patientId);
    }
  }

  loadStudies(id: string): void {
    this.dataService.getStudiesByPatientId(id).subscribe({
      next: (data) => {
        console.log('Studies loaded for patient:', id, data);
        this.studies = data;
      },
      error: (err) => {
        console.error('Error fetching studies:', err);
      }
    });
  }
}