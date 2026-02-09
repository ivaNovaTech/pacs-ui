import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DicomDataService } from '../../core/services/dicom-data.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-patient-dashboard',
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
  templateUrl: './patient-dashboard.component.html'
})
export class PatientDashboardComponent implements OnInit {
  patients: any[] = [];
  
  // FIXED: These strings MUST match the keys in your console log and the matColumnDef in HTML
  displayedColumns: string[] = ['id', 'mrn', 'last_name', 'first_name', 'date_of_birth', 'actions'];

  constructor(private dataService: DicomDataService) {}

  ngOnInit(): void {
    this.dataService.getPatients().subscribe({
      next: (data) => {
        console.log('Patients assigned to table:', data);
        this.patients = data;
      },
      error: (err) => console.error('Error fetching patients', err)
    });
  }
}