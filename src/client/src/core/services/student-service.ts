import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StudentResponse, UpdateStudentRequest } from '../../types/DTOs/StudentDTOs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + 'students';

  getAll() {
    return this.http.get<StudentResponse[]>(this.baseUrl);
  }
  getById(id: number) {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${id}`);
  }
  update(id: number, body: UpdateStudentRequest) {
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
