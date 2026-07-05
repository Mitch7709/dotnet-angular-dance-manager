import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BookingResponse, CreateBookingRequest, UpdateBookingRequest, UpdateBookingResponse } from '../../types/DTOs/BookingDTOs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/bookings';

  getAll() {
    return this.http.get<BookingResponse[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<BookingResponse>(`${this.baseUrl}/${id}`);
  }

  getForStudent() {
    return this.http.get<BookingResponse[]>(`${this.baseUrl}/student`);
  }

  getForSession(sessionId: number) {
    return this.http.get<BookingResponse[]>(`${this.baseUrl}/session/${sessionId}`);
  }

  create(booking: CreateBookingRequest) {
    return this.http.post<BookingResponse>(this.baseUrl, booking);
  }

  update(id: number, booking: UpdateBookingRequest) {
    return this.http.put<UpdateBookingResponse>(`${this.baseUrl}/${id}`, booking);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
