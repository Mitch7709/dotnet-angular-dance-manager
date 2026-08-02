import { Component, Input } from '@angular/core';
import { StudentResponse } from '../../../types/DTOs/StudentDTOs';

@Component({
  selector: 'app-personal-info-card',
  imports: [],
  templateUrl: './personal-info-card.html',
  styleUrl: './personal-info-card.css',
})
export class PersonalInfoCard {
  @Input() student: StudentResponse | null = null;

  protected isEditMode = false;

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    // Implement the logic to save changes here
    this.isEditMode = false;
  }

  cancelEdit(): void {
    this.isEditMode = false;

    var inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = input.defaultValue;
    });
  }
}
