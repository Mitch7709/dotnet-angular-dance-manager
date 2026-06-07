import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ClassTypeRequest, ClassTypeResponse } from '../../types/DTOs/ClassTypeDTOs';

@Injectable({
  providedIn: 'root',
})
export class ClasstypeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/class-types';
  
  getAll() {
    return this.http.get<ClassTypeResponse[]>(this.baseUrl);
  }
  getById(id: number) {
    return this.http.get<ClassTypeResponse>(`${this.baseUrl}/${id}`);
  }
  create(body: ClassTypeRequest) {
    return this.http.post<ClassTypeResponse>(this.baseUrl, body);
  }
  update(id: number, body: ClassTypeRequest) {
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
