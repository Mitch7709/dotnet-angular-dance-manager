import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentResponse, UpdateStudentRequest } from '../../../types/DTOs/StudentDTOs';
import { StudentService } from '../../../core/services/student-service';

@Component({
  selector: 'app-personal-info-card',
  imports: [FormsModule],
  templateUrl: './personal-info-card.html',
  styleUrl: './personal-info-card.css',
})
export class PersonalInfoCard implements OnChanges {
  private readonly studentService = inject(StudentService);

  @Input() student: StudentResponse | null = null;
  @Output() studentUpdated = new EventEmitter<StudentResponse>();

  protected isEditMode = false;
  protected editStudent: StudentResponse | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // Keep draft in sync when parent updates student and user is not actively editing
    if (changes['student'] && !this.isEditMode) {
      this.resetDraftFromStudent();
    }
  }

  toggleEditMode(): void {
    if (!this.isEditMode) {
      this.resetDraftFromStudent();
      this.isEditMode = true;
      return;
    }

    this.cancelEdit();
  }

  saveChanges(): void {
    if (!this.student || !this.editStudent) return;

    const payload: UpdateStudentRequest = {
      firstName: this.editStudent.firstName,
      lastName: this.editStudent.lastName,
      phoneNumber: this.editStudent.phoneNumber,
      email: this.editStudent.email,
      dateOfBirth: this.editStudent.dateOfBirth,
      bio: this.editStudent.bio,
      waiverStatus: this.student.waiverStatus,
    };

    this.studentService.update(this.student.id, payload).subscribe({
      next: () => {
        const updatedStudent: StudentResponse = {
          ...this.student!,
          ...this.editStudent!,
          id: this.student!.id,
        };

        this.student = updatedStudent;
        this.editStudent = { ...updatedStudent };
        this.studentUpdated.emit(updatedStudent);
        this.isEditMode = false;
      },
      error: (err) => {
        console.error('Failed to update student', err);
      },
    });
  }

  cancelEdit(): void {
    this.resetDraftFromStudent(); // revert unsaved edits
    this.isEditMode = false;
  }

  private resetDraftFromStudent(): void {
    this.editStudent = this.student ? { ...this.student } : null;
  }
}
