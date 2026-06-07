import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  setTheme(theme: string): void {
    // console.log(`Setting theme to ${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
