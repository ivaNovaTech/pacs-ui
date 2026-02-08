import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Study } from '../../core/models/study.model';

@Component({
  selector: 'app-study-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './study-dashboard.component.html',
  styleUrls: ['./study-dashboard.component.scss']
})
export class StudyDashboardComponent implements OnInit {
  mrn: string | null = '';
  studies: Study[] = [];
  
  displayedColumns: string[] = [
    'study_id', 
    'study_date', 
    'modality', 
    'description', 
    'study_uid', 
    'actions'
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Capture the MRN from the URL: /patients/:mrn/studies
    this.mrn = this.route.snapshot.paramMap.get('mrn');
    this.loadInitialStudies();
  }

  loadInitialStudies(): void {
    // Mock data using your specific field requirements
    this.studies = [
      {
        study_id: 5001,
        patient_id: 12,
        study_uid: '1.2.840.113619.2.1.99.44521',
        study_date: '2026-02-08T09:15:00',
        study_year: 2026,
        modality: 'MR',
        description: 'MRI BRAIN W WO CONTRAST',
        created_at: '2026-02-08T10:00:00',
        last_updated_at: '2026-02-08T10:00:00'
      }
    ];
  }

  viewSeries(study: Study) {
    console.log('Navigating to series for study:', study.study_uid);
    // Future step: this.router.navigate(['/studies', study.study_uid, 'series']);
  }
}