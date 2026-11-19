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
  template: `
    <div class="login-wrapper">
      <div class="login-card">

        <!-- LOGO & BRANDING -->
        <div class="login-brand">
          <img src="centurion-logo.jpg" alt="Centurion University Logo" class="brand-logo">
          <h1>Hostel Complaint Portal</h1>
          <p class="brand-sub">Centurion University of Technology and Management</p>
        </div>

        <!-- ==========================================
             LOGIN MODE
             ========================================== -->
        <ng-container *ngIf="!showForgotPassword">

          <!-- LARGE ROLE SELECTOR CARDS -->
          <div class="role-section">
            <label class="section-label">Select Your Role:</label>
            <div class="role-grid">
              <button
                type="button"
                class="role-card"
                [class.active]="role === 'student'"
                (click)="selectRole('student')"
              >
                <span class="role-icon">👩‍🎓</span>
                <span class="role-name">Student</span>
              </button>

              <button
                type="button"
                class="role-card"
                [class.active]="role === 'warden'"
                (click)="selectRole('warden')"
              >
                <span class="role-icon">👩‍🏫</span>
                <span class="role-name">Warden</span>
              </button>

              <button
                type="button"
                class="role-card"
                [class.active]="role === 'superintendent'"
                (click)="selectRole('superintendent')"
              >
                <span class="role-icon">👩‍💼</span>
                <span class="role-name">Superintendent</span>
              </button>

              <button
                type="button"
                class="role-card"
                [class.active]="role === 'admin'"
                (click)="selectRole('admin')"
              >
                <span class="role-icon">🏛️</span>
                <span class="role-name">Admin</span>
              </button>
            </div>
          </div>

          <!-- WARDEN NAME SELECTION (CLEAN NAMES ONLY, NO BLOCKS) -->
          <div class="form-group" *ngIf="role === 'warden'">
            <label for="wardenSelect">Assigned Warden Name *</label>
            <select
              id="wardenSelect"
              [(ngModel)]="selectedWarden"
              class="form-select-large"
            >
              <option value="Pramila Dash">Pramila Dash</option>
              <option value="Binod Manjari">Binod Manjari</option>
              <option value="Parbati Mahapatra">Parbati Mahapatra</option>
              <option value="Rashmi Rekha Swain">Rashmi Rekha Swain</option>
              <option value="Kanaklata Jena">Kanaklata Jena</option>
            </select>
          </div>

          <!-- USERNAME / REGISTRATION ID -->
          <div class="form-group">
            <label for="username">
              {{ role === 'student' ? 'College Registration ID' : 'Username / Staff ID' }} *
            </label>
            <input
              type="text"
              id="username"
              [(ngModel)]="username"
              [placeholder]="role === 'student' ? 'e.g. khushi' : 'e.g. pramila, admin'"
              class="form-input-large"
              autocomplete="username"
            />
          </div>

          <!-- PASSWORD -->
          <div class="form-group">
            <label for="password">Password *</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              placeholder="Enter your password"
              class="form-input-large"
              autocomplete="current-password"
            />
          </div>

          <!-- LOGIN BUTTON -->
          <button type="button" class="btn-login-submit" (click)="login()">
            Sign In to Portal →
          </button>

          <!-- FORGOT PASSWORD LINK -->
          <div class="forgot-wrapper">
            <button type="button" class="btn-forgot-link" (click)="openForgotPassword()">
              Forgot Password? Reset with Email OTP
            </button>
          </div>

          <!-- ERROR BANNER -->
          <div class="error-banner" *ngIf="errorMessage">
            ⚠️ {{ errorMessage }}
          </div>

        </ng-container>

        <!-- ==========================================
             FORGOT PASSWORD / OTP SCREEN
             ========================================== -->
        <ng-container *ngIf="showForgotPassword">
          <div class="forgot-container">
            <h2>Reset Password</h2>
            <p class="forgot-info">
              Enter your registered email address to receive a secure 6-digit verification OTP.
            </p>

            <!-- STEP 1: ENTER EMAIL -->
            <div *ngIf="forgotStep === 1">
              <div class="form-group">
                <label for="resetEmail">Registered Email Address *</label>
                <input
                  type="email"
                  id="resetEmail"
                  [(ngModel)]="resetEmail"
                  placeholder="e.g. sonarkhushi71@gmail.com"
                  class="form-input-large"
                />
              </div>

              <button
                type="button"
                class="btn-login-submit"
                [disabled]="isSendingOtp"
                (click)="requestPasswordReset()"
              >
                {{ isSendingOtp ? 'Sending OTP...' : 'Send 6-Digit OTP 📩' }}
              </button>
            </div>

            <!-- STEP 2: VERIFY OTP & ENTER NEW PASSWORD -->
            <div *ngIf="forgotStep === 2">
              <div class="form-group">
                <label for="resetOtp">Enter 6-Digit OTP Code *</label>
                <input
                  type="text"
                  id="resetOtp"
                  [(ngModel)]="resetOtp"
                  placeholder="e.g. 123456"
                  maxlength="6"
                  class="form-input-large otp-input"
                />
              </div>

              <div class="form-group">
                <label for="newPassword">New Password *</label>
                <input
                  type="password"
                  id="newPassword"
                  [(ngModel)]="newPassword"
                  placeholder="Enter at least 4 characters"
                  class="form-input-large"
                />
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm New Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  placeholder="Re-type new password"
                  class="form-input-large"
                />
              </div>

              <button
                type="button"
                class="btn-login-submit"
                [disabled]="isVerifyingOtp"
                (click)="verifyOtpAndResetPassword()"
              >
                {{ isVerifyingOtp ? 'Updating Password...' : 'Verify OTP & Set New Password ✅' }}
              </button>
            </div>

            <!-- BACK TO LOGIN -->
            <div class="forgot-wrapper">
              <button type="button" class="btn-forgot-link" (click)="backToLogin()">
                ← Back to Login
              </button>
            </div>

            <!-- SUCCESS MESSAGE -->
            <div class="success-banner" *ngIf="successMessage">
              {{ successMessage }}
            </div>

            <!-- ERROR MESSAGE -->
            <div class="error-banner" *ngIf="errorMessage">
              ⚠️ {{ errorMessage }}
            </div>
          </div>
        </ng-container>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: linear-gradient(135deg, #001833 0%, #002b5c 50%, #001f42 100%);
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 16px;
      box-sizing: border-box;
    }

    .login-wrapper {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }

    .login-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
      border-top: 5px solid #f59e0b;
    }

    /* BRANDING */
    .login-brand {
      text-align: center;
      margin-bottom: 24px;
    }

    .brand-logo {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      object-fit: cover;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 12px;
    }

    .login-brand h1 {
      margin: 0;
      font-size: 1.45rem;
      font-weight: 800;
      color: #0f172a;
    }

    .brand-sub {
      margin: 4px 0 0;
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 600;
    }

    /* ROLE SELECTOR */
    .role-section {
      margin-bottom: 22px;
    }

    .section-label {
      display: block;
      font-size: 0.88rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .role-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .role-card {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .role-card:hover {
      border-color: #94a3b8;
      background: #f1f5f9;
      transform: translateY(-1px);
    }

    .role-card.active {
      background: #eff6ff;
      border-color: #003366;
      box-shadow: 0 0 0 2px rgba(0, 51, 102, 0.2);
    }

    .role-icon {
      font-size: 1.5rem;
    }

    .role-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }

    .role-card.active .role-name {
      color: #003366;
    }

    /* FORM GROUPS */
    .form-group {
      margin-bottom: 18px;
    }

    .form-group label {
      display: block;
      font-size: 0.88rem;
      font-weight: 700;
      color: #334155;
      margin-bottom: 6px;
    }

    .form-input-large,
    .form-select-large {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      font-size: 1rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      outline: none;
      background: #ffffff;
      color: #0f172a;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input-large:focus,
    .form-select-large:focus {
      border-color: #003366;
      box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.15);
    }

    .otp-input {
      letter-spacing: 6px;
      font-size: 1.25rem;
      font-weight: 800;
      text-align: center;
    }

    /* SUBMIT BUTTON */
    .btn-login-submit {
      width: 100%;
      background: linear-gradient(135deg, #002244 0%, #003366 100%);
      color: #ffffff;
      border: none;
      padding: 14px;
      font-size: 1.05rem;
      font-weight: 800;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 51, 102, 0.25);
      transition: all 0.2s ease;
      margin-top: 8px;
    }

    .btn-login-submit:hover:not(:disabled) {
      background: linear-gradient(135deg, #001a33 0%, #002244 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(0, 51, 102, 0.35);
    }

    .btn-login-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* FORGOT LINK */
    .forgot-wrapper {
      text-align: center;
      margin-top: 16px;
    }

    .btn-forgot-link {
      background: none;
      border: none;
      color: #0284c7;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-forgot-link:hover {
      color: #0369a1;
      text-decoration: underline;
    }

    /* FORGOT SCREEN */
    .forgot-container h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
    }

    .forgot-info {
      margin: 6px 0 20px;
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.4;
    }

    /* BANNERS */
    .error-banner {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      margin-top: 16px;
    }

    .success-banner {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      margin-top: 16px;
    }
  `]
})
export class LoginComponent {

  role: string = 'student';
  username: string = '';
  password: string = '';
  selectedWarden: string = 'Pramila Dash';

  errorMessage: string = '';
  successMessage: string = '';

  // Password reset state
  showForgotPassword: boolean = false;
  forgotStep: number = 1;
  resetEmail: string = '';
  resetOtp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isSendingOtp: boolean = false;
  isVerifyingOtp: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  selectRole(r: string): void {
    this.role = r;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openForgotPassword(): void {
    this.showForgotPassword = true;
    this.forgotStep = 1;
    this.errorMessage = '';
    this.successMessage = '';
  }

  backToLogin(): void {
    this.showForgotPassword = false;
    this.forgotStep = 1;
    this.errorMessage = '';
    this.successMessage = '';
  }

  requestPasswordReset(): void {
    const email = String(this.resetEmail).trim();
    if (!email) {
      this.errorMessage = 'Please enter your registered email address.';
      return;
    }

    this.isSendingOtp = true;
    this.errorMessage = '';
    this.successMessage = '';

    const params = new HttpParams().set('email', email);

    this.http.post('http://localhost:8080/password/send-otp', null, {
      params,
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.isSendingOtp = false;
        this.successMessage = '✅ OTP sent! Please check your Gmail inbox.';
        this.forgotStep = 2;
      },
      error: () => {
        this.isSendingOtp = false;
        this.successMessage = '✅ Demo Mode: Check your IntelliJ console for the OTP code (or use 123456).';
        this.forgotStep = 2;
      }
    });
  }

  verifyOtpAndResetPassword(): void {
    const otp = String(this.resetOtp).trim();
    const newPass = String(this.newPassword);
    const confirmPass = String(this.confirmPassword);

    if (!otp) {
      this.errorMessage = 'Please enter the 6-digit OTP code.';
      return;
    }

    if (newPass.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters.';
      return;
    }

    if (newPass !== confirmPass) {
      this.errorMessage = 'Passwords do not match. Please re-enter.';
      return;
    }

    this.isVerifyingOtp = true;
    this.errorMessage = '';
    this.successMessage = '';

    const params = new HttpParams()
      .set('email', String(this.resetEmail).trim())
      .set('otp', otp)
      .set('newPassword', newPass);

    this.http.post('http://localhost:8080/password/verify-otp', null, {
      params,
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.isVerifyingOtp = false;
        this.successMessage = '🎉 Password reset successfully! You can now log in.';
        setTimeout(() => {
          this.backToLogin();
        }, 1500);
      },
      error: () => {
        this.isVerifyingOtp = false;
        this.errorMessage = 'Invalid or expired OTP. Please try again.';
      }
    });
  }

  login(): void {
    this.errorMessage = '';
    const trimmedUser = String(this.username).trim().toLowerCase();

    // 1. FAST STUDENT LOGIN (khushi / 1234)
    if (this.role === 'student' && trimmedUser === 'khushi' && this.password === '1234') {
      localStorage.setItem('loggedInRole', 'student');
      localStorage.setItem('studentName', 'Khushi');
      this.router.navigate(['/student-dashboard']);
      return;
    }

    // 2. FAST ADMIN LOGIN (admin / 1234)
    if (this.role === 'admin' && trimmedUser === 'admin' && this.password === '1234') {
      localStorage.setItem('loggedInRole', 'admin');
      this.router.navigate(['/admin']);
      return;
    }

    // 3. FAST WARDEN LOGIN (pramila / 1234)
    if (this.role === 'warden' && (trimmedUser === 'pramila' || trimmedUser === 'warden') && this.password === '1234') {
      localStorage.setItem('loggedInRole', 'warden');
      localStorage.setItem('loggedInWarden', this.selectedWarden || 'Pramila Dash');
      this.router.navigate(['/admin']);
      return;
    }

    // 4. FAST SUPERINTENDENT LOGIN (superintendent / 1234)
    if (this.role === 'superintendent' && trimmedUser === 'superintendent' && this.password === '1234') {
      localStorage.setItem('loggedInRole', 'superintendent');
      this.router.navigate(['/admin']);
      return;
    }

    // 5. DATABASE LOGIN (POSTGRESQL USERS)
    const params = new HttpParams()
      .set('collegeRegistrationId', String(this.username).trim())
      .set('password', String(this.password));

    this.http.post<any>('http://localhost:8080/auth/login', null, { params }).subscribe({
      next: (res) => {
        const uRole = (res.role || '').toLowerCase();
        localStorage.setItem('loggedInRole', uRole);
        localStorage.setItem('studentName', String(res.name || ''));

        if (uRole === 'student') {
          this.router.navigate(['/student-dashboard']);
        } else {
          if (uRole === 'warden') {
            localStorage.setItem('loggedInWarden', String(res.name || this.selectedWarden));
          }
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Invalid ID or password. Please verify your credentials.';
        }
      }
    });
  }
}
