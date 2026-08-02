import { Component, OnInit, inject, signal } from '@angular/core';
import { ProfileHeader } from '../profile-header/profile-header';
import { QuickLinks } from '../quick-links/quick-links';
import { PersonalInfoCard } from '../personal-info-card/personal-info-card';
import { StudentService } from '../../../core/services/student-service';
import { InstructorService } from '../../../core/services/instructor-service';
import { UserService } from '../../../core/services/user-service';
import type { StudentResponse } from '../../../types/DTOs/StudentDTOs';
import { InstructorResponse } from '../../../types/DTOs/InstructorDTOs';

@Component({
  selector: 'app-dashboard',
  imports: [ProfileHeader, QuickLinks, PersonalInfoCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [StudentService, InstructorService, UserService],
})
export class Dashboard implements OnInit {
  private studentService = inject(StudentService);
  private userService = inject(UserService);

  protected user = this.userService.currentUser();

  // Signal to hold the student data
  protected student = signal<StudentResponse | null>(null);
  protected instructor = signal<InstructorResponse | null>(null);

  ngOnInit(): void {
    const currentUser = this.userService.currentUser();
    if (currentUser?.roles.includes('Student')) {
      // Assuming studentService has a method to get a student by user ID
      this.studentService.getByUserId(currentUser.userId).subscribe((studentData) => {
        this.student.set(studentData);
      });
    }
  }
}
