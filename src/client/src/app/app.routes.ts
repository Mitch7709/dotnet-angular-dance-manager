import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { AuthComponent } from '../features/auth/auth.component';
import { Timeslot } from '../features/timeslot/timeslot';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'auth', component: AuthComponent},
    { path: 'timeslot', component: Timeslot}
];
