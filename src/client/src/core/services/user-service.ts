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
  StudentUser,
  InstructorUser,
} from '../../types/DTOs/UserDTOs';
import { tap } from 'rxjs';
import { StudentResponse } from '../../types/DTOs/StudentDTOs';
import { InstructorResponse } from '../../types/DTOs/InstructorDTOs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  private readonly _currentUser = signal<User | null>(null);
  private readonly _studentUser = signal<StudentUser | null>(null);
  private readonly _instructorUser = signal<InstructorUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly studentUser = this._studentUser.asReadonly();
  readonly instructorUser = this._instructorUser.asReadonly();

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  constructor() {
    this.hydrateUserFromStorage();
  }

  registerStudent(creds: RegisterStudentCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/student`, creds).pipe(
      tap((response) => {
        const user = this.decodeUserToken(response.token);
        this.hydrateUserStudentInfo(user!.roles);

        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  registerInstructor(creds: RegisterInstructorCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/instructor`, creds).pipe(
      tap((response) => {
        const user = this.decodeUserToken(response.token);
        this.hydrateUserInstructorInfo(user!.roles);

        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, creds).pipe(
      tap((response) => {
        const user = this.decodeUserToken(response.token);

        if (user?.roles?.includes('Student')) {
          this.hydrateUserStudentInfo(user!.roles);
        }
        else if (user?.roles?.includes('Instructor')) {
          this.hydrateUserInstructorInfo(user!.roles);
        }
        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  logout() {
    this._currentUser.set(null);
    this._studentUser.set(null);
    this._instructorUser.set(null);
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

  private GetStudentInfoForUser() {
    return this.http.get<StudentResponse>(`${this.baseUrl}/students/me`).pipe(
      tap((response) => {
        return response;
      })
    );
  }

  private GetInstructorInfoForUser() {
    return this.http.get<InstructorResponse>(`${this.baseUrl}/instructors/me`).pipe(
      tap((response) => {
        return response;
      })
    );
  }

  private hydrateUserFromStorage(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const user = this.decodeUserToken(token);

    if (!user || user.isExpired) {
      this.logout();
      return;
    }

    if (user?.roles?.includes('Student')) {
      this.hydrateUserStudentInfo(user!.roles);
    } else if (user?.roles?.includes('Instructor')) {
      this.hydrateUserInstructorInfo(user!.roles);
    }

  }

  private hydrateUserStudentInfo(roles: AppRole[]) {
    this.GetStudentInfoForUser().subscribe((studentResponse) => {
      this._studentUser.set({
        dateOfBirth: studentResponse.dateOfBirth,
        waiverStatus: studentResponse.waiverStatus,
      });
      this._currentUser.set({
        email: studentResponse.email,
        displayName: studentResponse.firstName + ' ' + studentResponse.lastName,
        roles: roles,
        imageUrl: studentResponse.imageUrl,
      });
      console.log(this.studentUser());
      console.log(this.currentUser());
    });
  }

  private hydrateUserInstructorInfo(roles: AppRole[]) {
    this.GetInstructorInfoForUser().subscribe((instructorResponse) => {
      this._instructorUser.set({
        bio: instructorResponse.bio,
        qualifiedClasses: instructorResponse.qualifiedClasses,
      });
      this._currentUser.set({
        email: instructorResponse.email,
        displayName: instructorResponse.firstName + ' ' + instructorResponse.lastName,
        roles: roles,
        imageUrl: instructorResponse.imageUrl,
      });
      console.log(this.instructorUser());
      console.log(this.currentUser());
    });
  }

  private decodeUserToken(token: string) {
    try {
      const payload = this.parseJwtPayload(token);

      const roles = payload[this.ROLE_CLAIM] ?? payload['role'] ?? [];
      const expMs = payload?.exp ? payload.exp * 1000 : null;

      const isExpired = expMs !== null && Date.now() >= expMs;
      const normalizedRoles = Array.isArray(roles) ? roles : [roles];
      return {  roles: normalizedRoles as AppRole[], isExpired };
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
