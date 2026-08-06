import { Component, OnInit, inject, signal } from '@angular/core';
import { ProfileHeader } from '../profile-header/profile-header';
import { QuickLinks } from '../quick-links/quick-links';
import { PersonalInfoCard } from '../personal-info-card/personal-info-card';
import { StudentService } from '../../../core/services/student-service';
import { InstructorService } from '../../../core/services/instructor-service';
import { UserService } from '../../../core/services/user-service';
import { UserInfo } from '../../../types/DTOs/UserDTOs';

@Component({
  selector: 'app-dashboard',
  imports: [ProfileHeader, QuickLinks, PersonalInfoCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [StudentService, InstructorService, UserService],
})
export class Dashboard implements OnInit {
  private userService = inject(UserService);

  protected user = this.userService.currentUser();

  // Signal to hold the student data
  protected personalInfo = signal<UserInfo | null>(null);

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (userInfo) => {
        this.personalInfo.set(userInfo);
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
      },
    });
  }

  userUpdated(updatedUser: UserInfo): void {
    // console.log('User updated:', updatedUser);
    this.user!.displayName = `${updatedUser.firstName} ${updatedUser.lastName}`;
    this.user!.email = updatedUser.email;
  }
}
