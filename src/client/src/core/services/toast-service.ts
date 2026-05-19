import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {
    this.CreateToastContainer();
  }

  private CreateToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end z-50';
      document.body.appendChild(container);
    }
  }
}
