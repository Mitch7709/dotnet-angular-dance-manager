import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { take } from 'rxjs/internal/operators/take';
import { ToastService } from '../../../core/services/toast-service';
import { getErrorMessage } from '../../../core/utils/error-handler';
import { PhotoService } from '../../../core/services/photo-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private userService = inject(UserService);
  private photoService = inject(PhotoService);
  private fb = inject(FormBuilder);

  protected registerForm: FormGroup;
  protected photoPreview: string | ArrayBuffer | null = null;

  private toastService = inject(ToastService);
  protected cdr = inject(ChangeDetectorRef);

  @Output() toggleMode = new EventEmitter<void>();

  constructor() {
    this.registerForm = this.fb.group({
      email: [''],
      password: [''],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      dateOfBirth: [''],
      bio: [''],
      photo: [null],
    });
  }

  onRoleChange(event: Event) {
    const target = event.target as HTMLInputElement;

    this.clearServerError('dateOfBirth');
    this.clearServerError('bio');
  }

  register() {
    const formData = this.registerForm.value;

    const studentCreds = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
    };

    this.userService.registerStudent(studentCreds).subscribe({
      next: (response) => {
        // this.toastService.success('Student registration successful');
        const photoFile = this.registerForm.get('photo')?.value;
        if (photoFile) {
          this.photoService.uploadStudentPhoto(response.userId, photoFile).subscribe({
            next: () => {
              this.toastService.success('Student registration successful');
            },
            error: (error: HttpErrorResponse) => {
              this.toastService.error(
                getErrorMessage(error, 'Student registration succeeded, but photo upload failed.'),
              );
            },
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.errors) {
          // Validation errors from EndpointValidationFilter
          const validationErrors: Record<string, string[]> = error.error.errors;

          this.displayValidationErrors(validationErrors);
        } else {
          this.toastService.error(getErrorMessage(error, 'Student registration failed.'));
        }
      },
    });
  }

  onPhotoSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.registerForm.patchValue({ photo: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
        this.cdr.detectChanges(); // Trigger change detection to update the view
      };
      reader.readAsDataURL(file);
    }
  }

  private displayValidationErrors(errors: Record<string, string[]>) {
    // console.log('Validation errors:', errors);
    const toCamel = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
    Object.entries(errors).forEach(([field, messages]) => {
      const control = this.registerForm.get(toCamel(field));
      control?.setErrors({ server: messages[0] });
      control?.markAsTouched();
      // auto-clear on edit:
      control?.valueChanges.pipe(take(1)).subscribe(() => control.setErrors(null));
    });
  }

  private clearServerError(field: string) {
    const control = this.registerForm.get(field);
    if (control) {
      control.setErrors(null);
    }
  }

  switchToLogin() {
    this.toggleMode.emit();
  }
}
