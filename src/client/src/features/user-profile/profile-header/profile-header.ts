import { Component, inject, Input } from '@angular/core';
import { User } from '../../../types/DTOs/UserDTOs';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.css',
})
export class ProfileHeader {
  @Input() user: User | null = null;
}
