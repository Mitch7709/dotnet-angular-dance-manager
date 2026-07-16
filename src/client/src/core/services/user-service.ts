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

  registerStudent(creds: RegisterStudentCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/student`, creds).pipe(
      tap((response) => {
        this.setCurrentUser(response);

        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  registerInstructor(creds: RegisterInstructorCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/instructor`, creds).pipe(
      tap((response) => {
        this.setCurrentUser(response);

        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, creds).pipe(
      tap((response) => {
        this.setCurrentUser(response);

        sessionStorage.setItem('token', response.token);
        console.log(this.currentUser());
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

  private hydrateUserFromStorage(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const user = this.decodeUserToken(token);

    if (!user || user.isExpired) {
      this.logout();
      return;
    }
    this._currentUser.set(user);
  }

  setCurrentUser(response: AuthResponse) {
    const user = this.decodeUserToken(response.token);

    this._currentUser.set(user);
  }

  private decodeUserToken(token: string) {
    try {
      const payload = this.parseJwtPayload(token);

      const roles = payload[this.ROLE_CLAIM] ?? payload['role'] ?? [];
      const expMs = payload?.exp ? payload.exp * 1000 : null;
      const isExpired = expMs !== null && Date.now() >= expMs;
      const normalizedRoles = Array.isArray(roles) ? roles : [roles];

      const user: User = {
        userId: payload.sub,
        email: payload.email,
        displayName: payload.displayName,
        imageUrl: payload.imageUrl,
        roles: normalizedRoles as AppRole[],
      };
      return { ...user, isExpired };
    } catch {
      return null;
    }
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const payload = this.parseJwtPayload(token);
      return payload?.sub ?? null;
    } catch {
      return null;
    }
  }

  private parseJwtPayload(token: string): any {
    const part = token.split('.')[1];
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(padded));
  }
}
