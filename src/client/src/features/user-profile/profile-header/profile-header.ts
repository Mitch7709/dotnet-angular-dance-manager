import { Component, inject } from '@angular/core';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.css',
})
export class ProfileHeader {
  protected userService = inject(UserService);
}
