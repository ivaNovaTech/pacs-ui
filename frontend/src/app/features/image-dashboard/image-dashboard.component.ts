import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-image-dashboard',
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
  templateUrl: './image-dashboard.component.html',
  styleUrls: ['./image-dashboard.component.scss']
})
export class ImageDashboardComponent implements OnInit {
  seriesUid: string = '';
  imageRecords: any[] = [];
  displayedColumns: string[] = ['instance_number', 'sop_instance_uid', 'content_date', 'content_time', 'rows', 'columns'];

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.seriesUid = this.route.snapshot.paramMap.get('seriesUid') || 'Unknown';
    this.loadMockImageRecords();
  }

  loadMockImageRecords(): void {
    // These represent the database records for individual DICOM instances
    this.imageRecords = [
      { 
        instance_number: 1, 
        sop_instance_uid: '1.2.840.113619.2.1.1', 
        content_date: '2026-02-08', 
        content_time: '10:30:01', 
        rows: 512, 
        columns: 512 
      },
      { 
        instance_number: 2, 
        sop_instance_uid: '1.2.840.113619.2.1.2', 
        content_date: '2026-02-08', 
        content_time: '10:30:02', 
        rows: 512, 
        columns: 512 
      }
    ];
  }

  goBack(): void {
    this.location.back();
  }
}