import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { AuthComponent } from '../features/Auth-components/auth/auth.component';
import { Timeslot } from '../features/timeslot/timeslot';
import { Classtype } from '../features/classtype/classtype';
import { roleGuard } from '../core/guards/role-guard';
import { Session } from '../features/session/session';
import { Booking } from '../features/booking/booking';

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
  {
    path: 'sessions',
    component: Session,
    canActivate: [roleGuard],
    data: { roles: ['Instructor', 'Admin'] },
  },
  {
    path: 'bookings',
    component: Booking,
    canActivate: [roleGuard]
  }
];
