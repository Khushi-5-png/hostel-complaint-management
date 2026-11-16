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

        <!-- ==========================================
             1. STANDARD LOGIN SCREEN
             ========================================== -->
        <ng-container *ngIf="!showForgotPassword">
          <h1>Hostel Portal Login</h1>

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
              <option value="admin">Administrator</option>
            </select>
          </div>

          <!-- USERNAME / REGISTRATION ID -->
          <div class="form-group">
            <label for="username">
              {{ role === 'student' ? 'College Registration ID' : 'Username / Staff ID' }}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              placeholder="Enter your ID or username"
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

          <!-- FORGOT PASSWORD LINK -->
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

        <!-- ==========================================
             2. FORGOT PASSWORD (2-STEP OTP SCREEN)
             ========================================== -->
        <ng-container *ngIf="showForgotPassword">
          <h1>Reset Password</h1>

          <!-- STEP 1: ENTER EMAIL -->
          <ng-container *ngIf="!otpSent">
            <p class="forgot-password-text">
              Enter your registered email address. We will send a 6-digit OTP code to verify your account.
            </p>

            <div class="form-group">
              <label for="resetEmail">Registered Email Address</label>
              <input
                type="email"
                id="resetEmail"
                name="resetEmail"
                [(ngModel)]="resetEmail"
                placeholder="e.g. sonarkhushi71@gmail.com"
                autocomplete="email"
              >
            </div>

            <button type="button" (click)="requestPasswordReset()" [disabled]="isSubmitting">
              {{ isSubmitting ? 'Sending OTP to Gmail...' : 'Send OTP' }}
            </button>
          </ng-container>

          <!-- STEP 2: ENTER OTP & NEW PASSWORD -->
          <ng-container *ngIf="otpSent">
            <p class="forgot-password-text" style="color: #003366; font-weight: 600;">
              ✅ OTP has been sent to {{ resetEmail }}! Please enter it below.
            </p>

            <div class="form-group">
              <label for="resetOtp">Enter 6-Digit OTP</label>
              <input
                type="text"
                id="resetOtp"
                name="resetOtp"
                [(ngModel)]="resetOtp"
                placeholder="Enter 6-digit OTP from email"
                maxlength="6"
              >
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                [(ngModel)]="newPassword"
                placeholder="Enter new password"
              >
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                placeholder="Re-enter new password"
              >
            </div>

            <button type="button" (click)="verifyOtpAndResetPassword()" [disabled]="isSubmitting">
              {{ isSubmitting ? 'Updating Password...' : 'Verify OTP & Change Password' }}
            </button>
          </ng-container>

          <!-- BACK TO LOGIN -->
          <button
            type="button"
            class="forgot-password-button"
            (click)="backToLogin()"
          >
            ← Back to Login
          </button>

          <!-- MESSAGES -->
          <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
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

  showForgotPassword = false;
  otpSent = false;
  isSubmitting = false;

  resetEmail = '';
  resetOtp = '';
  newPassword = '';
  confirmPassword = '';

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
    this.otpSent = false;
    this.resetEmail = '';
    this.resetOtp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  backToLogin() {
    this.showForgotPassword = false;
    this.otpSent = false;
    this.resetEmail = '';
    this.resetOtp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  // 1. SEND REAL OTP
  requestPasswordReset() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.resetEmail.trim()) {
      this.errorMessage = 'Please enter your registered email address.';
      return;
    }

    this.isSubmitting = true;
    const email = this.resetEmail.trim().toLowerCase();
    const params = new HttpParams().set('email', email);

    this.http.post(
      'http://localhost:8080/password/send-otp',
      null,
      { params, responseType: 'text' }
    ).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.otpSent = true;
        this.successMessage = response || 'OTP sent successfully! Check your Gmail.';
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Password reset error:', error);
        this.errorMessage = 'Unable to send OTP. Please check your backend connection.';
      }
    });
  }

  // 2. VERIFY REAL OTP & CHANGE PASSWORD
  verifyOtpAndResetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.resetOtp.trim()) {
      this.errorMessage = 'Please enter the 6-digit OTP from your email.';
      return;
    }

    if (!this.newPassword) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }

    if (this.newPassword.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters long.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please re-enter.';
      return;
    }

    this.isSubmitting = true;
    const email = this.resetEmail.trim().toLowerCase();

    const params = new HttpParams()
      .set('email', email)
      .set('otp', this.resetOtp.trim())
      .set('newPassword', this.newPassword);

    this.http.post(
      'http://localhost:8080/password/verify-otp',
      null,
      { params, responseType: 'text' }
    ).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response || 'Password changed successfully! You can now log in.';
        setTimeout(() => {
          this.backToLogin();
          this.successMessage = 'Password reset! You can now log in with your new password.';
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('OTP verification error:', error);
        if (error.error) {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Invalid or expired OTP. Please try again.';
        }
      }
    });
  }

  // 3. STANDARD LOGIN
  login() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.role || !this.username.trim() || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const trimmedUsername = this.username.trim().toLowerCase();

    // Fast Student Login
    if (this.role === 'student' && trimmedUsername === 'khushi' && this.password === '1234') {
      localStorage.setItem('loggedInRole', 'student');
      localStorage.setItem('studentName', 'Khushi');
      this.router.navigate(['/student-dashboard']);
      return;
    }

    // Fast Admin Login
    if (this.role === 'admin' && trimmedUsername === 'admin' && this.password === '1234') {
      localStorage.setItem('loggedInRole', 'admin');
      this.router.navigate(['/admin']);
      return;
    }

    // Fast Warden Login
    if (this.role === 'warden' && (trimmedUsername === 'pramila' || trimmedUsername === 'warden') && this.password === '1234') {
      localStorage.setItem('loggedInRole', 'warden');
      localStorage.setItem('loggedInWarden', 'Pramila Dash');
      this.router.navigate(['/admin']);
      return;
    }

    // Fast Superintendent Login
    if (this.role === 'superintendent' && trimmedUsername === 'superintendent' && this.password === '1234') {
      localStorage.setItem('loggedInRole', 'superintendent');
      this.router.navigate(['/admin']);
      return;
    }

    // Database Login
    const cleanId = String(this.username).trim();
    const cleanPassword = String(this.password);

    const params = new HttpParams()
      .set('collegeRegistrationId', cleanId)
      .set('password', cleanPassword);

    this.http.post<any>('http://localhost:8080/auth/login', null, { params }).subscribe({
      next: (response) => {
        const userRole = (response.role || '').toLowerCase();

        localStorage.setItem('loggedInRole', userRole);
        localStorage.setItem('studentName', String(response.name || ''));

        if (userRole === 'student') {
          this.router.navigate(['/student-dashboard']);
        } else {
          if (userRole === 'warden') {
            localStorage.setItem('loggedInWarden', String(response.name || ''));
          }
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Invalid ID or password. Please verify your credentials.';
        }
      }
    });
  }
}
