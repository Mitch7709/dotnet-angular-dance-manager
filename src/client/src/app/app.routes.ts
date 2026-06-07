import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { AuthComponent } from '../features/auth/auth.component';
import { Timeslot } from '../features/timeslot/timeslot';
import { Classtype } from '../features/classtype/classtype';
import { roleGuard } from '../core/guards/role-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'auth', component: AuthComponent },
  {
    path: 'timeslot',
    component: Timeslot,
    canActivate: [roleGuard],
    data: { roles: ['Instructor', 'Admin'] },
  },
  {
    path: 'classtype',
    component: Classtype,
    canActivate: [roleGuard],
    data: { roles: ['Instructor', 'Admin'] },
  }
];
