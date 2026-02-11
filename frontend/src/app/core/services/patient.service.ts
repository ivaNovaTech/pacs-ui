import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Fetches patients with server-side pagination and search
   */
  getPatients(limit: number = 10, offset: number = 0, search: string = ''): Observable<any> {
    let url = `${this.apiUrl}/api/patients/?limit=${limit}&offset=${offset}`;
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    return this.http.get<any>(url);
  }
}