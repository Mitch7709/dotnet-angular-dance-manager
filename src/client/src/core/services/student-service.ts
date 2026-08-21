import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StudentResponse, UpdateStudentRequest } from '../../types/DTOs/StudentDTOs';
import { StudentUser } from '../../types/DTOs/UserDTOs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/students';

  getAll() {
    return this.http.get<StudentResponse[]>(this.baseUrl);
  }
  getById(id: number) {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${id}`);
  }
  getByUserId(userId: string) {
    const url = `${this.baseUrl}/me`;
    const options = { params: { userId } };
    return this.http.get<StudentResponse>(url, options);
  }
  update(id: number, body: UpdateStudentRequest) {
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }
  updateWaiverStatus(id: number, status: string) {
    const body = {  status };
    return this.http.put<StudentUser>(`${this.baseUrl}/waiver/${id}`, body);
  }
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
