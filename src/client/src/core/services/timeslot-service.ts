import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreateTimeSlotRequest, TimeSlotResponse, UpdateTimeSlotRequest } from '../../types/DTOs/TimeSlotDTOs';

@Injectable({
  providedIn: 'root',
})
export class TimeslotService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/time-slots';

  getAll() {
    return this.http.get<TimeSlotResponse[]>(this.baseUrl);
  }
  getById(id: number) {
    return this.http.get<TimeSlotResponse>(`${this.baseUrl}/${id}`);
  }
  create(body: CreateTimeSlotRequest) {
    return this.http.post<TimeSlotResponse>(this.baseUrl, body);
  }
  update(id: number, body: UpdateTimeSlotRequest) {
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
