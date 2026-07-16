import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/photos';

  uploadStudentPhoto(id: string, file: File) {
    const formData = new FormData();
    formData.append('imageFile', file);
    return this.http.post(`${this.baseUrl}`, formData);
  }
}
