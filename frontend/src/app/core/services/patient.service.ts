import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Patient } from '../models/patient.model'; 

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // Add the trailing slash here to prevent 301 redirects from the backend
  private apiUrl = `${environment.apiUrl}/api/patients/`;

  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getPatientById(id: number | string): Observable<Patient> {
    // This results in /api/patients/{id}/
    return this.http.get<Patient>(`${this.apiUrl}${id}/`);
  }
}