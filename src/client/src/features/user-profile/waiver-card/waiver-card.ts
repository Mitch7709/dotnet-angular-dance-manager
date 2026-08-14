import { Component, inject, Input, OnInit } from '@angular/core';
import { UserInfo } from '../../../types/DTOs/UserDTOs';
import { UserService } from '../../../core/services/user-service';
import { StudentService } from '../../../core/services/student-service';
import { StudentResponse } from '../../../types/DTOs/StudentDTOs';

@Component({
  selector: 'app-waiver-card',
  imports: [],
  templateUrl: './waiver-card.html',
  styleUrl: './waiver-card.css',
})
export class WaiverCard implements OnInit {
  protected studentService = inject(StudentService);

  @Input() studentInfo: StudentResponse | null = null;

  ngOnInit(): void {
    
  }
}
