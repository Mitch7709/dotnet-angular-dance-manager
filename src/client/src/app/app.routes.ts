import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { AuthComponent } from '../features/Auth-components/auth/auth.component';
import { Timeslot } from '../features/timeslot/timeslot';
import { Classtype } from '../features/classtype/classtype';
import { roleGuard } from '../core/guards/role-guard';
import { Booking } from '../features/booking/booking';
import { Dashboard } from '../features/user-profile/dashboard/dashboard';
import { CreateSession } from '../features/sessions/create-session/create-session';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'auth', component: AuthComponent },
  {
    path: 'timeslots',
    component: Timeslot,
    canActivate: [roleGuard],
    data: { roles: ['Instructor', 'Admin'] },
  },
  {
    path: 'classtypes',
    component: Classtype,
    canActivate: [roleGuard],
    data: { roles: ['Instructor', 'Admin'] },
  },
  // {
  //   path: 'sessions',
  //   component: Session,
  //   canActivate: [roleGuard],
  //   data: { roles: ['Instructor', 'Admin'] },
  // },
  {
    path: 'create-session',
    component: CreateSession,
    canActivate: [roleGuard],
    data: { roles: ['Instructor', 'Admin'] },
  },
  {
    path: 'bookings',
    component: Booking,
    canActivate: [roleGuard]
  },
  {
    path: 'profile',
    component: Dashboard,
    canActivate: [roleGuard]
  }
];
