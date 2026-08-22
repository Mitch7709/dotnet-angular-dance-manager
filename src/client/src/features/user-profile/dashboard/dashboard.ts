import { Component, OnInit, inject, signal } from '@angular/core';
import { ProfileHeader } from '../profile-header/profile-header';
import { QuickLinks } from '../quick-links/quick-links';
import { PersonalInfoCard } from '../personal-info-card/personal-info-card';
import { StudentService } from '../../../core/services/student-service';
import { InstructorService } from '../../../core/services/instructor-service';
import { UserService } from '../../../core/services/user-service';
import { User, UserInfo } from '../../../types/DTOs/UserDTOs';
import { WaiverCard } from '../waiver-card/waiver-card';
import { QualifiedClasses } from '../qualified-classes/qualified-classes';
import { StudentResponse } from '../../../types/DTOs/StudentDTOs';
import { InstructorResponse } from '../../../types/DTOs/InstructorDTOs';

@Component({
  selector: 'app-dashboard',
  imports: [ProfileHeader, QuickLinks, PersonalInfoCard, WaiverCard, QualifiedClasses],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [StudentService, InstructorService, UserService],
})
export class Dashboard implements OnInit {
  private userService = inject(UserService);
  private studentService = inject(StudentService);
  private instructorService = inject(InstructorService);

  protected user = this.userService.currentUser();

  protected personalInfo = signal<UserInfo | null>(null);
  protected studentInfo = signal<StudentResponse | null>(null);
  protected instructorInfo = signal<InstructorResponse | null>(null);

  ngOnInit(): void {
    const user = this.user;

    if (user !== null) {
      this.userService.getUserInfo().subscribe({
        next: (userInfo) => {
          console.log('User info fetched:', userInfo);
          this.personalInfo.set(userInfo);

          if (user.roles.includes('Student')) {
            userInfo.studentUser = { waiverStatus: '', id: 0 };

            this.studentService.getByUserId(user.userId).subscribe({
              next: (response) => {
                // Handle student info here
                userInfo.studentUser!.waiverStatus = response.waiverStatus;
                this.studentInfo.set(response);
              },
              error: (error) => {
                console.error('Error fetching student info:', error);
              },
            });
          }
          else if (user.roles.includes('Instructor')) {
            userInfo.instructorUser = { qualifiedClasses: [] };

            this.instructorService.getByUserId(user.userId).subscribe({
              next: (response) => {
                userInfo.instructorUser!.qualifiedClasses = response.qualifiedClasses;
                this.instructorInfo.set(response);
              },
              error: (error) => {
                console.error('Error fetching instructor info:', error);
              },
            });
          }
        },
        error: (error) => {
          console.error('Error fetching user info:', error);
        },
      });
    }
  }

  userUpdated(updatedUser: UserInfo): void {
    // console.log('User updated:', updatedUser);
    var user = this.userService.currentUser();

    if (user !== null) {
      user.displayName = `${updatedUser.firstName} ${updatedUser.lastName}`;
      user.email = updatedUser.email;
    }
    this.personalInfo.set(updatedUser);

    //Manually bind user properties to studentInfo if user is a student
    if (user !== null && user.roles.includes('Student')) {
      const currentStudentInfo = this.studentInfo();
      if (currentStudentInfo) {
        currentStudentInfo.email = updatedUser.email;
        currentStudentInfo.firstName = updatedUser.firstName;
        currentStudentInfo.lastName = updatedUser.lastName;
        currentStudentInfo.phoneNumber = updatedUser.phoneNumber;
        this.studentInfo.set(currentStudentInfo);
      }
    }
  }
}
