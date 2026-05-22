import { CanActivateFn } from '@angular/router';
import { AppRole, UserService } from '../services/user-service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const user = inject(UserService);

  if (!user.isAuthenticated()) {
    console.warn('Access denied: User is not authenticated');
    return false;
  }

  const required = (route.data?.['roles'] ?? []) as AppRole[];
  if (required.length === 0 || user.hasAnyRole(required)) return true;

  console.warn('Access denied: User does not have required role(s)', { required });
  return false;
};
