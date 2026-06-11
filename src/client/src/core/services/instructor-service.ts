import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Instructor } from '../../types/DTOs/InstructorDTOs';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/instructors';

  getAll() {
    return this.http.get<Instructor[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Instructor>(`${this.baseUrl}/${id}`);
  }
}
