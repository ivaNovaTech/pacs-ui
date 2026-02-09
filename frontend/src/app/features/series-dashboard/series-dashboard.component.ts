import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { DicomDataService } from '../../core/services/dicom-data.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-series-dashboard',
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
  templateUrl: './series-dashboard.component.html'
})
export class SeriesDashboardComponent implements OnInit {
  seriesList: any[] = [];
  studyId: string | null = null;
  
  displayedColumns: string[] = [
    'series_number', 
    'modality', 
    'body_part_examined', 
    'description', 
    'study_year', 
    'actions'
  ];

  constructor(
    private route: ActivatedRoute,
    private dataService: DicomDataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // The key 'studyId' must match the parameter name in your app.routes.ts
    this.studyId = this.route.snapshot.paramMap.get('studyId');
    if (this.studyId) {
      this.loadSeries(this.studyId);
    }
  }

  loadSeries(id: string): void {
    this.dataService.getSeriesByStudyId(id).subscribe({
      next: (data) => {
        this.seriesList = data;
      },
      error: (err) => {
        console.error('Error fetching series from backend:', err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}