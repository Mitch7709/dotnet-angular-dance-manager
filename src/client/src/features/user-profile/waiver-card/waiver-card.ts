import { Component, inject, Input, OnInit } from '@angular/core';
import { UserInfo } from '../../../types/DTOs/UserDTOs';
import { UserService } from '../../../core/services/user-service';
import { StudentService } from '../../../core/services/student-service';
import { StudentResponse } from '../../../types/DTOs/StudentDTOs';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-waiver-card',
  imports: [],
  templateUrl: './waiver-card.html',
  styleUrl: './waiver-card.css',
})
export class WaiverCard implements OnInit {
  protected studentService = inject(StudentService);
  protected toastService = inject(ToastService);

  @Input() studentInfo: StudentResponse | null = null;

  ngOnInit(): void {

  }

  get canSignWaiver(): boolean {
    return this.studentInfo?.waiverStatus !== 'Signed';
  }

  SignWaiver(): void {
    if (!this.studentInfo) return;

    this.studentService.updateWaiverStatus(this.studentInfo.id, 'Signed').subscribe({
      next: (response) => {
        this.studentInfo!.waiverStatus = response.waiverStatus;
        this.toastService.success('Waiver signed successfully');
      },
      error: (error) => {
        console.error('Error signing waiver:', error);
      }
    });
  }
}
