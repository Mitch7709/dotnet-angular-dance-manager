import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentResponse, UpdateStudentRequest } from '../../../types/DTOs/StudentDTOs';
import { UserService } from '../../../core/services/user-service';
import { UserInfo } from '../../../types/DTOs/UserDTOs';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-personal-info-card',
  imports: [FormsModule],
  templateUrl: './personal-info-card.html',
  styleUrl: './personal-info-card.css',
})
export class PersonalInfoCard implements OnChanges {
  private readonly userService = inject(UserService);
  private toastService = inject(ToastService);

  @Input() userInfo: UserInfo | null = null;
  @Output() userUpdated = new EventEmitter<UserInfo>();

  protected isEditMode = false;
  protected editUser: UserInfo | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // Keep draft in sync when parent updates student and user is not actively editing
    if (changes['userInfo'] && !this.isEditMode) {
      this.resetDraftFromUser();
    }
  }

  toggleEditMode(): void {
    if (!this.isEditMode) {
      this.resetDraftFromUser();
      this.isEditMode = true;
      return;
    }

    this.cancelEdit();
  }

  saveChanges(): void {
    if (!this.userInfo || !this.editUser) return;

    const payload: UserInfo = {
      firstName: this.editUser.firstName,
      lastName: this.editUser.lastName,
      phoneNumber: this.editUser.phoneNumber,
      email: this.editUser.email,
      dateOfBirth: this.editUser.dateOfBirth,
      bio: this.editUser.bio
    };

    this.userService.updateUser(payload).subscribe({
      next: () => {
        const updatedUser: UserInfo = {
          ...this.userInfo!,
          ...this.editUser!,
        };

        this.userInfo = updatedUser;
        this.editUser = { ...updatedUser };
        this.userUpdated.emit(updatedUser);
        this.isEditMode = false;

        this.toastService.success('User information updated successfully');
      },
      error: (err) => {
        console.error('Failed to update user', err.error.errors);
        this.toastService.error('Failed to update user information');
      },
    });
  }

  cancelEdit(): void {
    this.resetDraftFromUser(); // revert unsaved edits
    this.isEditMode = false;
  }

  private resetDraftFromUser(): void {
    this.editUser = this.userInfo ? { ...this.userInfo } : null;
  }
}
