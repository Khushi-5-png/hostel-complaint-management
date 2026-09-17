import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="reset-container">
      <div class="reset-box">

        <img src="centurion-logo.jpg" class="logo" alt="Centurion University">

        <h2>Reset Password</h2>
        <p class="subtitle">Hostel Complaint Management System</p>

        <div *ngIf="message" class="message success">
          {{ message }}
        </div>

        <div *ngIf="errorMessage" class="message error">
          {{ errorMessage }}
        </div>

        <form *ngIf="!passwordReset" (ngSubmit)="resetPassword()">

          <label>New Password</label>
          <input
            type="password"
            [(ngModel)]="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
            required
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

        <button
          *ngIf="passwordReset"
          type="button"
          class="login-button"
          (click)="goToLogin()"
        >
          Back to Login
        </button>

      </div>
    </div>
  `,
  styles: [`
    .reset-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f4f6f8;
      padding: 20px;
    }

    .reset-box {
      width: 100%;
      max-width: 420px;
      background: white;
      padding: 35px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    }

    .logo {
      display: block;
      width: 90px;
      margin: 0 auto 20px;
    }

    h2 {
      text-align: center;
      margin-bottom: 8px;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 25px;
    }

    label {
      display: block;
      margin-top: 15px;
      margin-bottom: 6px;
      font-weight: 600;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    button {
      width: 100%;
      margin-top: 22px;
      padding: 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .message {
      padding: 12px;
      margin-bottom: 15px;
      border-radius: 6px;
      text-align: center;
    }

    .success {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .error {
      background: #ffebee;
      color: #c62828;
    }

    .login-button {
      margin-top: 10px;
    }
  `]
})
export class ResetPasswordComponent {

  token = '';

  newPassword = '';
  confirmPassword = '';

  message = '';
  errorMessage = '';
  passwordReset = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.errorMessage = 'Invalid password reset link.';
    }
  }

  resetPassword() {

    this.message = '';
    this.errorMessage = '';

    if (!this.token) {
      this.errorMessage = 'Invalid password reset link.';
      return;
    }

    if (this.newPassword.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const params = new HttpParams()
      .set('token', this.token)
      .set('newPassword', this.newPassword);

    this.http.post(
      'http://localhost:8080/password/reset',
      null,
      {
        params,
        responseType: 'text'
      }
    ).subscribe({
      next: (response) => {
        this.message = response;
        this.passwordReset = true;
      },
      error: (error) => {
        this.errorMessage =
          error.error || 'Unable to reset password.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
