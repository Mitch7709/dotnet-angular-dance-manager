import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Register } from "../register/register";
import { Login } from '../login/login';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, Register, Login],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  protected isRegisterMode: boolean = true;

  toggleRegisterMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }
}
