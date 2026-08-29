import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">

      <div class="login-card">

        <h1>Hostel Management Login</h1>

        <p class="subtitle">
          Login to continue
        </p>

        <div class="form-group">
          <label for="role">Login As</label>

          <select
            id="role"
            name="role"
            [(ngModel)]="role"
          >
            <option value="">Select Role</option>
            <option value="warden">Warden</option>
            <option value="superintendent">Superintendent</option>
          </select>
        </div>

        <div class="form-group">
          <label for="username">Username</label>

          <input
            type="text"
            id="username"
            name="username"
            [(ngModel)]="username"
            placeholder="Enter username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>

          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            placeholder="Enter password"
          />
        </div>

        <button type="button" (click)="login()">
          Login
        </button>

        <p class="error" *ngIf="errorMessage">
          {{ errorMessage }}
        </p>

      </div>

    </div>
  `
})
export class LoginComponent {

  role = '';
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {

    this.errorMessage = '';

    if (!this.role || !this.username || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (
      this.role === 'warden' &&
      this.username === 'warden' &&
      this.password === '1234'
    ) {
      localStorage.setItem('loggedInRole', 'warden');
      this.router.navigate(['/warden']);
      return;
    }

    if (
      this.role === 'superintendent' &&
      this.username === 'superintendent' &&
      this.password === '1234'
    ) {
      localStorage.setItem('loggedInRole', 'superintendent');
      this.router.navigate(['/superintendent']);
      return;
    }

    this.errorMessage = 'Invalid username or password.';
  }
}
