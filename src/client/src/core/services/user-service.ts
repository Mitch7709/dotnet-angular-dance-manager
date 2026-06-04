import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AppRole,
  AuthResponse,
  LoginCreds,
  RegisterInstructorCreds,
  RegisterStudentCreds,
  User,
} from '../../types/DTOs/UserDTOs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  login(creds: LoginCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, creds).pipe(
      tap((response) => {
        // localStorage.setItem('token', response.token);
        const user = this.decodeUserFromToken(response.token);
        this._currentUser.set(user);
        // console.log('Decoded user from token:', user);
      }),
    );
  }

  registerStudent(creds: RegisterStudentCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/student`, creds).pipe(
      tap((response) => {
        // localStorage.setItem('token', response.token);
        const user = this.decodeUserFromToken(response.token);
        this._currentUser.set(user);
      }),
    );
  }

  registerInstructor(creds: RegisterInstructorCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/instructor`, creds).pipe(
      tap((response) => {
        // localStorage.setItem('token', response.token);
        const user = this.decodeUserFromToken(response.token);
        this._currentUser.set(user);
      }),
    );
  }

  decodeUserFromToken(token: string): User | null {
    try {
      const payload = this.parseJwtPayload(token);
      const email = payload['email'];
      const displayName = payload['given_name'] || email;
      const roles = payload[this.ROLE_CLAIM] ?? payload['role'] ?? [];
      const normalizedRoles = Array.isArray(roles) ? roles : [roles];
      return { email, displayName, roles: normalizedRoles as AppRole[] };
    }
    catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasAnyRole(requiredRoles: AppRole[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return requiredRoles.some(role => user.roles.includes(role));
  }

  private parseJwtPayload(token: string): any {
    const part = token.split('.')[1];
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(padded));
  }
}
