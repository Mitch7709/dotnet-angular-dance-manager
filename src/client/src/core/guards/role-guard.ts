import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user-service';
import { inject } from '@angular/core';
import { AppRole } from '../../types/DTOs/UserDTOs';
import { ToastService } from '../services/toast-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const user = inject(UserService);
  const toast = inject(ToastService);

  if (!user.isAuthenticated()) {
    // console.warn('Access denied: User is not authenticated');
    toast.error('You must be logged in to access this page');
    return false;
  }

  const required = (route.data?.['roles'] ?? []) as AppRole[];
  if (required.length === 0 || user.hasAnyRole(required)) return true;

  // console.warn('Access denied: User does not have required role(s)', { required });
  toast.error('You do not have the required role(s) to access this page');
  return false;
};
