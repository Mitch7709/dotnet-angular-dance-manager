import { Component, inject } from '@angular/core';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-personal-info-card',
  imports: [],
  templateUrl: './personal-info-card.html',
  styleUrl: './personal-info-card.css',
})
export class PersonalInfoCard {
  protected userService = inject(UserService);

  protected fullName: string = this.userService.currentUser()?.displayName || '';
  protected firstName: string = this.fullName.split(' ')[0] || '';
  protected lastName: string = this.fullName.split(' ')[1] || '';
}
