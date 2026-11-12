import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  styleUrl: './app.css',
  template: `
    <div class="login-container">
      <div class="login-card">

        <!-- LOGO -->
        <div class="login-logo">
          <img src="centurion-logo.jpg" alt="Centurion University Logo">
        </div>

        <!-- LOGIN MODE -->
        <ng-container *ngIf="!showForgotPassword">
          <h1>Login</h1>

          <!-- ROLE -->
          <div class="form-group">
            <label for="role">Login As</label>
            <select
              id="role"
              name="role"
              [(ngModel)]="role"
              (change)="resetFields()"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="warden">Warden</option>
              <option value="superintendent">Superintendent</option>
            </select>
          </div>

          <!-- USERNAME / REGISTRATION ID -->
          <div class="form-group">
            <label for="username">College Registration ID</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              placeholder="Enter registration ID"
              autocomplete="username"
            >
          </div>

          <!-- PASSWORD -->
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              placeholder="Enter password"
              autocomplete="current-password"
            >
          </div>

          <!-- LOGIN BUTTON -->
          <button type="button" (click)="login()">Login</button>

          <!-- FORGOT PASSWORD -->
          <button
            type="button"
            class="forgot-password-button"
            (click)="openForgotPassword()"
          >
            Forgot Password?
          </button>

          <!-- ERROR -->
          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
        </ng-container>

        <!-- FORGOT PASSWORD SCREEN -->
        <ng-container *ngIf="showForgotPassword">
          <h1>Forgot Password</h1>
          <p class="forgot-password-text">
            Enter your registered email address. We will send you an OTP to reset your password.
          </p>

          <!-- EMAIL -->
          <div class="form-group">
            <label for="resetEmail">Email Address</label>
            <input
              type="email"
              id="resetEmail"
              name="resetEmail"
              [(ngModel)]="resetEmail"
              placeholder="Enter registered email"
              autocomplete="email"
            >
          </div>

          <!-- SEND OTP -->
          <button type="button" (click)="requestPasswordReset()">Send OTP</button>

          <!-- BACK -->
          <button
            type="button"
            class="forgot-password-button"
            (click)="backToLogin()"
          >
            Back to Login
          </button>

          <!-- SUCCESS -->
          <p class="success" *ngIf="successMessage">{{ successMessage }}</p>

          <!-- ERROR -->
          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
        </ng-container>

      </div>
    </div>
  `
})
export class LoginComponent {

  role = '';
  username = '';
  password = '';

  // FORGOT PASSWORD
  showForgotPassword = false;
  resetEmail = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  resetFields() {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  openForgotPassword() {
    this.showForgotPassword = true;
    this.resetEmail = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  backToLogin() {
    this.showForgotPassword = false;
    this.resetEmail = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  // =========================
  // REQUEST PASSWORD RESET (SEND OTP)
  // =========================
  requestPasswordReset() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.resetEmail.trim()) {
      this.errorMessage = 'Please enter your registered email address.';
      return;
    }

    const email = this.resetEmail.trim().toLowerCase();
    const params = new HttpParams().set('email', email);

    this.http.post(
      'http://localhost:8080/password/send-otp',
      null,
      { params, responseType: 'text' }
    ).subscribe({
      next: (response) => {
        this.successMessage = response;
      },
      error: (error) => {
        console.error('Password reset error:', error);
        if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Unable to send OTP. Please check your email and make sure the backend is running.';
        }
      }
    });
  }

  // =========================
  // LOGIN VIA BACKEND API
  // =========================
  login() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.role || !this.username.trim() || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const params = new HttpParams()
      .set('collegeRegistrationId', this.username.trim())
      .set('password', this.password);

    this.http.post<any>(
      'http://localhost:8080/auth/login',
      null,
      { params }
    ).subscribe({
      next: (response) => {
        const userRole = (response.role || '').toLowerCase();

        // Check if selected role matches user's assigned role
        if (this.role.toLowerCase() !== userRole) {
          this.errorMessage = `Account found, but you are registered as a ${response.role}, not a ${this.role}.`;
          return;
        }

        // Store login session
        localStorage.setItem('loggedInRole', userRole);
        localStorage.setItem('studentName', response.name);

        // Redirect based on role
        if (userRole === 'warden') {
          localStorage.setItem('loggedInWarden', response.name);
          this.router.navigate(['/warden']);
        } else if (userRole === 'superintendent') {
          this.router.navigate(['/superintendent']);
        } else {
          this.router.navigate(['/student-dashboard']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Invalid credentials or unable to connect to backend.';
        }
      }
    });
  }
}
