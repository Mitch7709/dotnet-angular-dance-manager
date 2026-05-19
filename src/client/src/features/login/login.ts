import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TextInput } from '../../shared/text-input/text-input';
import { UserService } from '../../core/services/user-service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [TextInput, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  protected credentialsForm: FormGroup;

  constructor() {
    this.credentialsForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  login() {
    const formData = this.credentialsForm.value;

    const loginCreds = {
      email: formData.email,
      password: formData.password,
    };

    this.userService.login(loginCreds).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.errors) {
          // Validation errors from EndpointValidationFilter
          const validationErrors: Record<string, string[]> = error.error.errors;
          Object.entries(validationErrors).forEach(([field, messages]) => {
            const control = this.credentialsForm.get(field.toLowerCase());
            control?.setErrors({ server: messages[0] });
            control?.markAsTouched();
            // auto-clear on edit:
            control?.valueChanges.pipe(take(1)).subscribe(() => control.setErrors(null));
          });
        } else {
          console.error('Login failed:', error);
        }
      },
    });
  }
}
