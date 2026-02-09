import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DicomDataService {
  private apiUrl = 'http://localhost:8000'; 

  constructor(private http: HttpClient) {}

  // Fetch all patients from the DB
  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients/`);
  }

  // Patient (id) -> Study (patient_id)
// Updated to match the new FastAPI route
getStudiesByPatientId(patientId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/studies/by-patient/${patientId}`);
}



getSeriesByStudyId(studyId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/series/by-study/${studyId}`);
  }

 getImagesBySeriesId(seriesId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/images/by-series/${seriesId}`);
  }
}