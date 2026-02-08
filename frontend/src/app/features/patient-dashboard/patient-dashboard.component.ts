import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatToolbarModule, 
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
  providers: [DatePipe]
})
export class PatientDashboardComponent implements OnInit {
  patients: Patient[] = [
    { 
      mrn: 'MRN-7721', 
      last_name: 'DOE',
      first_name: 'JOHN', 
      middle_name: 'QUINCY',
      prefix: 'MR',
      suffix: 'JR',
      sex: 'M', 
      date_of_birth: '1985-05-20T00:00:00'
    },
    { 
      mrn: 'MRN-8832', 
      last_name: 'SMITH',
      first_name: 'JANE', 
      middle_name: 'ALICE',
      prefix: 'DR',
      suffix: '',
      sex: 'F', 
      date_of_birth: '1992-11-03T00:00:00'
    }
  ];

  // Added 'actions' here
  displayedColumns: string[] = ['mrn', 'hl7_name', 'sex', 'dob', 'actions'];

  constructor() {}

  ngOnInit(): void {}

  formatHl7Name(p: Patient): string {
    return `${p.last_name}^${p.first_name}^${p.middle_name}^${p.prefix}^${p.suffix}`;
  }

  viewStudies(patient: Patient) {
    console.log(`Navigating to studies for MRN: ${patient.mrn}`);
    // Logic for router navigation or opening a viewer goes here
  }
}