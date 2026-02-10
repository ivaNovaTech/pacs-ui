import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Series } from '../models/series.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  // Using the same pattern as your Study Service for consistency
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all series associated with a specific Study
   * series.study_id matches study.id
   */
  getSeriesByStudy(studyId: number): Observable<Series[]> {
    // Dynamically building the URL to /api/series
    return this.http.get<Series[]>(`${this.baseUrl}/series`).pipe(
      map((series: Series[]) => 
        series.filter(s => s.study_id === studyId)
      )
    );
  }

  /**
   * Fetches a single series by its unique database ID
   */
  getSeriesById(id: number): Observable<Series> {
    return this.http.get<Series>(`${this.baseUrl}/series/${id}`);
  }
}