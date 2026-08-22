import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { InstructorResponse } from '../../types/DTOs/InstructorDTOs';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/instructors';

  getAll() {
    return this.http.get<InstructorResponse[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<InstructorResponse>(`${this.baseUrl}/${id}`);
  }
  getByUserId(userId: string) {
      const url = `${this.baseUrl}/me`;
      const options = { params: { userId } };
      return this.http.get<InstructorResponse>(url, options);
    }
}
