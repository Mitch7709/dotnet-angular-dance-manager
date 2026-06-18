import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SessionRequest, SessionResponse } from '../../types/DTOs/SessionDTOs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/sessions';

  getAll() {
      return this.http.get<SessionResponse[]>(this.baseUrl);
    }
    getById(id: number) {
      return this.http.get<SessionResponse>(`${this.baseUrl}/${id}`);
    }
    create(body: SessionRequest) {
      return this.http.post<SessionResponse>(this.baseUrl, body);
    }
    update(id: number, body: SessionRequest) {
      return this.http.put<SessionResponse>(`${this.baseUrl}/${id}`, body);
    }
    delete(id: number) {
      return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
