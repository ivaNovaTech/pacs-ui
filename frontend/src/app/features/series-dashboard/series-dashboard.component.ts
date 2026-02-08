import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Series } from '../../core/models/series.model';

@Component({
  selector: 'app-series-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './series-dashboard.component.html',
  styleUrls: ['./series-dashboard.component.scss']
})
export class SeriesDashboardComponent implements OnInit {
  studyUid: string | null = '';
  seriesList: Series[] = [];
  
  // Columns matching your specific requirements
  displayedColumns: string[] = [
    'series_number', 
    'description', 
    'modality', 
    'study_year', 
    'series_uid', 
    'actions'
  ];

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Capture the Study UID from the URL
    this.studyUid = this.route.snapshot.paramMap.get('studyUid');
    this.loadMockSeries();
  }

  loadMockSeries(): void {
    // Mocking data based on your specific backend fields
    this.seriesList = [
      {
        study_id: 101,
        series_uid: '1.2.840.113619.2.5.11.1',
        series_number: 1,
        modality: 'CT',
        body_part_examined: 'CHEST',
        description: 'SCOUT',
        study_year: 2026,
        created_at: new Date().toISOString(),
        last_updated_at: new Date().toISOString()
      },
      {
        study_id: 101,
        series_uid: '1.2.840.113619.2.5.11.2',
        series_number: 2,
        modality: 'CT',
        body_part_examined: 'CHEST',
        description: 'AXIAL 5.0 SOFT TISSUE',
        study_year: 2026,
        created_at: new Date().toISOString(),
        last_updated_at: new Date().toISOString()
      }
    ];
  }

  goBack(): void {
    this.location.back();
  }
}