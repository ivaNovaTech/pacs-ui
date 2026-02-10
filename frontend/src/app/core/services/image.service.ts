import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Image } from '../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/api/patients`;

  constructor(private http: HttpClient) {}

  // Ensure the return type is Observable<Image[]>
  getImages(pid: number, sid: number, serid: number): Observable<Image[]> {
    return this.http.get<Image[]>(
      `${this.apiUrl}/${pid}/studies/${sid}/series/${serid}/images`
    );
  }

  getImageThumbnailUrl(imageId: number): string {
    return `${environment.apiUrl}/api/images/${imageId}/render`;
  }
}