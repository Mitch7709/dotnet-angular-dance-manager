import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../core/services/user-service';
import { take } from 'rxjs';
import { ToastService } from '../../../core/services/toast-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected loginForm: FormGroup;

  @Output() toggleMode = new EventEmitter<void>();

  constructor() {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  login() {
    const formData = this.loginForm.value;

    const loginCreds = {
      email: formData.email,
      password: formData.password,
    };

    this.userService.login(loginCreds).subscribe({
      next: (response) => {
        // console.log('Login successful:', response);
        this.toast.success('Login successful!');
        this.router.navigate(['/profile']); // Redirect to home or dashboard after successful login
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.errors) {
          // Validation errors from EndpointValidationFilter
          const validationErrors: Record<string, string[]> = error.error.errors;
          Object.entries(validationErrors).forEach(([field, messages]) => {
            const control = this.loginForm.get(field.toLowerCase());
            control?.setErrors({ server: messages[0] });
            control?.markAsTouched();
            // auto-clear on edit:
            control?.valueChanges.pipe(take(1)).subscribe(() => control.setErrors(null));
          });
        } else {
          this.toast.error('Login failed: ' + (error.error?.error || 'Unknown error') );
        }
      },
    });
  }

  switchToRegister() {
    this.toggleMode.emit();
  }
}
