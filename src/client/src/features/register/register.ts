import { Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextInput } from '../../shared/text-input/text-input';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [TextInput, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  protected credentialsForm: FormGroup;
  role: 'Student' | 'Instructor' = 'Student';

  constructor() {
    this.credentialsForm = this.fb.group({
      email: [''],
      password: [''],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      dateOfBirth: [''],
      bio: [''],
    });
  }

  onRoleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.role = target.value as 'Student' | 'Instructor';

    this.clearServerError('dateOfBirth');
    this.clearServerError('bio');
  }

  register() {
    const formData = this.credentialsForm.value;

    if (this.role === 'Student') {
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
          console.log('Student registration successful:', response);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400 && error.error?.errors) {
            // Validation errors from EndpointValidationFilter
            const validationErrors: Record<string, string[]> = error.error.errors;

            this.displayValidationErrors(validationErrors);
          } else {
            console.error('Student registration failed:', error);
          }
        },
      });
    } else if (this.role === 'Instructor') {
      const instructorCreds = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
      };

      this.userService.registerInstructor(instructorCreds).subscribe({
        next: (response) => {
          console.log('Instructor registration successful:', response);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400 && error.error?.errors) {
            // Validation errors from EndpointValidationFilter
            const validationErrors: Record<string, string[]> = error.error.errors;

            this.displayValidationErrors(validationErrors);
          } else {
            console.error('Instructor registration failed:', error);
          }
        },
      });
    }
  }

  private displayValidationErrors(errors: Record<string, string[]>) {
    // console.log('Validation errors:', errors);
    const toCamel = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
    Object.entries(errors).forEach(([field, messages]) => {
      const control = this.credentialsForm.get(toCamel(field));
      control?.setErrors({ server: messages[0] });
      control?.markAsTouched();
      // auto-clear on edit:
      control?.valueChanges.pipe(take(1)).subscribe(() => control.setErrors(null));
    });
  }

  private clearServerError(field: string) {
    const control = this.credentialsForm.get(field);
    if (control) {
      control.setErrors(null);
    }
  }
}
