import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Study } from '../models/study.model';

@Injectable({
  providedIn: 'root'
})
export class StudyService {
  // Use the environment variable to point to https://pacs.ivanova.tech
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  /** * GET: Fetch all studies for a specific patient.
   * Matches URL: /api/patients/{patient_id}/studies
   */
  getStudiesByPatient(patientId: number): Observable<Study[]> {
    return this.http.get<Study[]>(`${this.baseUrl}/patients/${patientId}/studies`);
  }

  /** * GET: Fetch a single study by its ID
   */
  getStudyById(studyId: number): Observable<Study> {
    // We can also keep the global /studies route as a fallback
    return this.http.get<Study>(`${this.baseUrl}/studies/${studyId}`);
  }
}