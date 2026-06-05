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

  constructor() {
    this.hydrateUserFromStorage();
  }

  login(creds: LoginCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, creds).pipe(
      tap((response) => {
        const user = this.decodeUserFromToken(response.token);
        this._currentUser.set(user);
        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  registerStudent(creds: RegisterStudentCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/student`, creds).pipe(
      tap((response) => {
        const user = this.decodeUserFromToken(response.token);
        this._currentUser.set(user);
        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  registerInstructor(creds: RegisterInstructorCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/instructor`, creds).pipe(
      tap((response) => {
        const user = this.decodeUserFromToken(response.token);
        this._currentUser.set(user);
        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  logout() {
    this._currentUser.set(null);
    sessionStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasAnyRole(requiredRoles: AppRole[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return requiredRoles.some((role) => user.roles.includes(role));
  }

  private decodeUserFromToken(token: string): User | null {
    try {
      const payload = this.parseJwtPayload(token);
      const email = payload['email'];
      const displayName = payload['given_name'] || email;
      const roles = payload[this.ROLE_CLAIM] ?? payload['role'] ?? [];
      const normalizedRoles = Array.isArray(roles) ? roles : [roles];
      return { email, displayName, roles: normalizedRoles as AppRole[] };
    } catch {
      return null;
    }
  }

  private hydrateUserFromStorage(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const user = this.decodeUserFromToken(token);
    const payload = user ? this.parseJwtPayload(token) : null;
    const expMs = payload?.exp ? payload.exp * 1000 : null;
    const isExpired = expMs !== null && Date.now() >= expMs;

    if (!user || isExpired) {
      this.logout();
      return;
    }

    this._currentUser.set(user);
  }

  private parseJwtPayload(token: string): any {
    const part = token.split('.')[1];
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(padded));
  }
}
