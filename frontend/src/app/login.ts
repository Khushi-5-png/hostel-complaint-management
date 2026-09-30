import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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

        <!-- LOGIN -->
        <ng-container *ngIf="!showForgotPassword">

          <h1>Student Login</h1>

          <div class="form-group">
            <label for="collegeId">
              College Registration ID
            </label>

            <input
              type="text"
              id="collegeId"
              name="collegeId"
              [(ngModel)]="collegeRegistrationId"
              placeholder="Enter college registration ID"
            />
          </div>

          <div class="form-group">
            <label for="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              placeholder="Enter password"
            />
          </div>

          <button
            type="button"
            (click)="login()"
          >
            Login
          </button>

          <button
            type="button"
            class="forgot-password-button"
            (click)="openForgotPassword()"
          >
            Forgot Password?
          </button>

          <p
            class="success"
            *ngIf="successMessage"
          >
            {{ successMessage }}
          </p>

          <p
            class="error"
            *ngIf="errorMessage"
          >
            {{ errorMessage }}
          </p>

        </ng-container>


        <!-- FORGOT PASSWORD -->
        <ng-container *ngIf="showForgotPassword">

          <h1>Forgot Password</h1>

          <!-- STEP 1 -->
          <ng-container *ngIf="!otpSent">

            <p class="forgot-password-text">
              Enter your registered college email.
            </p>

            <div class="form-group">
              <label for="resetEmail">
                College Email
              </label>

              <input
                type="email"
                id="resetEmail"
                name="resetEmail"
                [(ngModel)]="resetEmail"
                placeholder="Enter registered college email"
              />
            </div>

            <button
              type="button"
              (click)="sendOtp()"
            >
              Send OTP
            </button>

          </ng-container>


          <!-- STEP 2 -->
          <ng-container *ngIf="otpSent">

            <div class="form-group">
              <label for="otp">
                OTP
              </label>

              <input
                type="text"
                id="otp"
                name="otp"
                [(ngModel)]="otp"
                placeholder="Enter 6-digit OTP"
                maxlength="6"
              />
            </div>

            <div class="form-group">
              <label for="newPassword">
                New Password
              </label>

              <input
                type="password"
                id="newPassword"
                name="newPassword"
                [(ngModel)]="newPassword"
                placeholder="Enter new password"
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">
                Confirm Password
              </label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="button"
              (click)="verifyOtpAndChangePassword()"
            >
              Change Password
            </button>

            <button
              type="button"
              class="forgot-password-button"
              (click)="sendOtp()"
            >
              Resend OTP
            </button>

          </ng-container>


          <button
            type="button"
            class="forgot-password-button"
            (click)="backToLogin()"
          >
            Back to Login
          </button>

          <p
            class="success"
            *ngIf="successMessage"
          >
            {{ successMessage }}
          </p>

          <p
            class="error"
            *ngIf="errorMessage"
          >
            {{ errorMessage }}
          </p>

        </ng-container>

      </div>

    </div>
  `
})
export class LoginComponent {

  collegeRegistrationId = '';

  password = '';

  showForgotPassword = false;

  resetEmail = '';

  otp = '';

  newPassword = '';

  confirmPassword = '';

  otpSent = false;

  successMessage = '';

  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login() {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.collegeRegistrationId.trim() ||
      !this.password
    ) {
      this.errorMessage =
        'Please enter your college registration ID and password.';
      return;
    }

    this.http.post(
      'http://localhost:8080/auth/login',
      null,
      {
        params: {
          collegeRegistrationId:
            this.collegeRegistrationId.trim(),

          password: this.password
        },

        responseType: 'text'
      }
    ).subscribe({

      next: (response) => {

        this.successMessage = response;

        localStorage.setItem(
          'collegeRegistrationId',
          this.collegeRegistrationId.trim()
        );

        localStorage.setItem(
          'loggedInRole',
          'student'
        );

        this.router.navigate([
          '/student-dashboard'
        ]);
      },

      error: (error) => {

        if (typeof error.error === 'string') {

          this.errorMessage = error.error;

        } else {

          this.errorMessage =
            'Invalid college registration ID or password.';
        }
      }
    });
  }


  openForgotPassword() {

    this.showForgotPassword = true;

    this.resetEmail = '';

    this.otp = '';

    this.newPassword = '';

    this.confirmPassword = '';

    this.otpSent = false;

    this.errorMessage = '';

    this.successMessage = '';
  }


  sendOtp() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.resetEmail.trim()) {

      this.errorMessage =
        'Please enter your registered college email.';

      return;
    }

    this.http.post(
      'http://localhost:8080/password/send-otp',
      null,
      {
        params: {
          email: this.resetEmail.trim()
        },

        responseType: 'text'
      }
    ).subscribe({

      next: (response) => {

        this.otpSent = true;

        this.successMessage =
          'OTP sent successfully to your email.';
      },

      error: (error) => {

        if (typeof error.error === 'string') {

          this.errorMessage = error.error;

        } else {

          this.errorMessage =
            'Unable to send OTP.';
        }
      }
    });
  }


  verifyOtpAndChangePassword() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.otp.trim()) {

      this.errorMessage =
        'Please enter the OTP.';

      return;
    }

    if (!this.newPassword) {

      this.errorMessage =
        'Please enter a new password.';

      return;
    }

    if (this.newPassword !== this.confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }

    this.http.post(
      'http://localhost:8080/password/verify-otp',
      null,
      {
        params: {
          email: this.resetEmail.trim(),
          otp: this.otp.trim(),
          newPassword: this.newPassword
        },

        responseType: 'text'
      }
    ).subscribe({

      next: (response) => {

        this.successMessage =
          'Password changed successfully.';

        this.otpSent = false;

        this.otp = '';

        this.newPassword = '';

        this.confirmPassword = '';
      },

      error: (error) => {

        if (typeof error.error === 'string') {

          this.errorMessage = error.error;

        } else {

          this.errorMessage =
            'Unable to change password.';
        }
      }
    });
  }


  backToLogin() {

    this.showForgotPassword = false;

    this.otpSent = false;

    this.resetEmail = '';

    this.otp = '';

    this.newPassword = '';

    this.confirmPassword = '';

    this.errorMessage = '';

    this.successMessage = '';
  }
}
