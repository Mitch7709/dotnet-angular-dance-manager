import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginCreds,
  RegisterInstructorCreds,
  RegisterStudentCreds,
} from '../../types/DTOs/UserDTOs';
import { tap } from 'rxjs';

export type AppRole = 'Student' | 'Instructor' | 'Admin';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  login(creds: LoginCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, creds).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  registerStudent(creds: RegisterStudentCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/student`, creds).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  registerInstructor(creds: RegisterInstructorCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/instructor`, creds).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.parseJwtPayload(token);
      if (!payload?.exp) return true;
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getRoles(): AppRole[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = this.parseJwtPayload(token);
      const raw = payload[this.ROLE_CLAIM] ?? payload['role'];
      if (Array.isArray(raw)) return raw as AppRole[];
      if (typeof raw === 'string') return [raw as AppRole];
      return [];
    } catch {
      return [];
    }
  }

  hasAnyRole(required: AppRole[]): boolean {
    const current = this.getRoles();
    return required.some((r) => current.includes(r));
  }

  private parseJwtPayload(token: string): any {
    const part = token.split('.')[1];
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(padded));
  }
}
