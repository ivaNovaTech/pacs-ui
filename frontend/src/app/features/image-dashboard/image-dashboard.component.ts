import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { DicomDataService } from '../../core/services/dicom-data.service';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-image-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './image-dashboard.component.html'
})
export class ImageDashboardComponent implements OnInit {
  images: any[] = [];
  seriesId: string | null = null;

  // Define all fields to be displayed in the table
  displayedColumns: string[] = [
    'instance_number',
    'modality',
    'rows',
    'columns',
    'image_position',
    'image_uid',
    'transfer_syntax_uid',
    'study_year'
  ];

  constructor(
    private route: ActivatedRoute,
    private dataService: DicomDataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.seriesId = this.route.snapshot.paramMap.get('seriesId');
    if (this.seriesId) {
      this.loadImages(this.seriesId);
    }
  }

  loadImages(id: string): void {
    this.dataService.getImagesBySeriesId(id).subscribe({
      next: (data) => {
        this.images = data;
      },
      error: (err) => {
        console.error('Error fetching images:', err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}