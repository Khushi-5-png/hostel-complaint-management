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

        <!-- =========================
             LOGO
             ========================= -->

        <div class="login-logo">

          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
          >

        </div>


        <!-- =========================
             LOGIN MODE
             ========================= -->

        <ng-container *ngIf="!showForgotPassword">

          <h1>
            Login
          </h1>


          <!-- ROLE -->

          <div class="form-group">

            <label for="role">
              Login As
            </label>

            <select
              id="role"
              name="role"
              [(ngModel)]="role"
              (change)="resetFields()"
            >

              <option value="">
                Select Role
              </option>

              <option value="student">
                Student
              </option>

              <option value="warden">
                Warden
              </option>

              <option value="superintendent">
                Superintendent
              </option>

            </select>

          </div>


          <!-- WARDEN -->

          <div
            class="form-group"
            *ngIf="role === 'warden'"
          >

            <label for="selectedWarden">
              Warden
            </label>

            <select
              id="selectedWarden"
              name="selectedWarden"
              [(ngModel)]="selectedWarden"
            >

              <option value="">
                Select Warden
              </option>

              <option
                *ngFor="let warden of wardens"
                [value]="warden.name"
              >
                {{ warden.name }}
              </option>

            </select>

          </div>


          <!-- USERNAME -->

          <div class="form-group">

            <label for="username">
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              placeholder="Enter username"
              autocomplete="username"
            >

          </div>


          <!-- PASSWORD -->

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
              autocomplete="current-password"
            >

          </div>


          <!-- LOGIN BUTTON -->

          <button
            type="button"
            (click)="login()"
          >
            Login
          </button>


          <!-- FORGOT PASSWORD -->

          <button
            type="button"
            class="forgot-password-button"
            (click)="openForgotPassword()"
          >
            Forgot Password?
          </button>


          <!-- ERROR -->

          <p
            class="error"
            *ngIf="errorMessage"
          >
            {{ errorMessage }}
          </p>

        </ng-container>


        <!-- =========================
             FORGOT PASSWORD SCREEN
             ========================= -->

        <ng-container *ngIf="showForgotPassword">

          <h1>
            Forgot Password
          </h1>


          <p class="forgot-password-text">
            Enter your registered email address.
            We will send you a password reset link.
          </p>


          <!-- EMAIL -->

          <div class="form-group">

            <label for="resetEmail">
              Email Address
            </label>

            <input
              type="email"
              id="resetEmail"
              name="resetEmail"
              [(ngModel)]="resetEmail"
              placeholder="Enter registered email"
              autocomplete="email"
            >

          </div>


          <!-- SEND RESET LINK -->

          <button
            type="button"
            (click)="requestPasswordReset()"
          >
            Send Reset Link
          </button>


          <!-- BACK -->

          <button
            type="button"
            class="forgot-password-button"
            (click)="backToLogin()"
          >
            Back to Login
          </button>


          <!-- SUCCESS -->

          <p
            class="success"
            *ngIf="successMessage"
          >
            {{ successMessage }}
          </p>


          <!-- ERROR -->

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

  role = '';

  username = '';

  password = '';

  selectedWarden = '';


  // =========================
  // FORGOT PASSWORD
  // =========================

  showForgotPassword = false;

  resetEmail = '';

  successMessage = '';

  errorMessage = '';


  // =========================
  // WARDEN ACCOUNTS
  // =========================

  wardens = [

    {
      name: 'Pramila Dash',
      username: 'pramila',
      password: '1234'
    },

    {
      name: 'Parbati Mahapatra',
      username: 'parbati',
      password: '1234'
    },

    {
      name: 'Rashmi Rekha Swain',
      username: 'rashmi',
      password: '1234'
    },

    {
      name: 'Binod Manjari',
      username: 'binod',
      password: '1234'
    },

    {
      name: 'Kanaklata Jena',
      username: 'kanaklata',
      password: '1234'
    }

  ];


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  // =========================
  // RESET LOGIN FIELDS
  // =========================

  resetFields() {

    this.username = '';

    this.password = '';

    this.selectedWarden = '';

    this.errorMessage = '';

    this.successMessage = '';

  }


  // =========================
  // OPEN FORGOT PASSWORD
  // =========================

  openForgotPassword() {

    this.showForgotPassword = true;

    this.resetEmail = '';

    this.errorMessage = '';

    this.successMessage = '';

  }


  // =========================
  // BACK TO LOGIN
  // =========================

  backToLogin() {

    this.showForgotPassword = false;

    this.resetEmail = '';

    this.errorMessage = '';

    this.successMessage = '';

  }


  // =========================
  // REQUEST PASSWORD RESET
  // =========================

  requestPasswordReset() {

    this.errorMessage = '';

    this.successMessage = '';


    if (!this.resetEmail.trim()) {

      this.errorMessage =
        'Please enter your registered email address.';

      return;

    }


    const email =
      this.resetEmail
        .trim()
        .toLowerCase();


    this.http.post(
      'http://localhost:8080/password/forgot',
      null,
      {
        params: {
          email: email
        },
        responseType: 'text'
      }
    ).subscribe({

      next: (response) => {

        this.successMessage = response;

      },

      error: (error) => {

        console.error(
          'Password reset error:',
          error
        );

        if (typeof error.error === 'string') {

          this.errorMessage = error.error;

        } else {

          this.errorMessage =
            'Unable to send reset link. Please check your email address and make sure the backend is running.';

        }

      }

    });

  }


  // =========================
  // LOGIN
  // =========================

  login() {

    this.errorMessage = '';

    this.successMessage = '';


    // EMPTY FIELDS

    if (
      !this.role ||
      !this.username.trim() ||
      !this.password
    ) {

      this.errorMessage =
        'Please fill in all required fields.';

      return;

    }


    // =========================
    // STUDENT LOGIN
    // =========================

    if (this.role === 'student') {

      const studentUsername =
        this.username
          .trim()
          .toLowerCase();


      if (
        studentUsername === 'khushi' &&
        this.password === '1234'
      ) {

        localStorage.setItem(
          'loggedInRole',
          'student'
        );

        localStorage.setItem(
          'studentName',
          'Khushi'
        );

        this.router.navigate([
          '/student-dashboard'
        ]);

        return;

      }


      this.errorMessage =
        'Invalid student username or password.';

      return;

    }


    // =========================
    // WARDEN LOGIN
    // =========================

    if (this.role === 'warden') {

      if (!this.selectedWarden) {

        this.errorMessage =
          'Please select a warden.';

        return;

      }


      const selectedAccount =
        this.wardens.find(
          (warden) =>
            warden.name ===
            this.selectedWarden
        );


      if (
        selectedAccount &&
        this.username
          .trim()
          .toLowerCase() ===
        selectedAccount.username &&
        this.password ===
        selectedAccount.password
      ) {

        localStorage.setItem(
          'loggedInRole',
          'warden'
        );

        localStorage.setItem(
          'loggedInWarden',
          selectedAccount.name
        );

        this.router.navigate([
          '/warden'
        ]);

        return;

      }


      this.errorMessage =
        'Invalid warden username or password.';

      return;

    }


    // =========================
    // SUPERINTENDENT LOGIN
    // =========================

    if (
      this.role ===
      'superintendent'
    ) {

      if (
        this.username
          .trim()
          .toLowerCase() ===
        'superintendent' &&
        this.password ===
        '1234'
      ) {

        localStorage.setItem(
          'loggedInRole',
          'superintendent'
        );

        this.router.navigate([
          '/superintendent'
        ]);

        return;

      }


      this.errorMessage =
        'Invalid superintendent username or password.';

      return;

    }


    this.errorMessage =
      'Invalid login details.';

  }

}import { Component } from '@angular/core';
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

        <!-- =========================
             LOGO
             ========================= -->

        <div class="login-logo">

          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
          >

        </div>


        <!-- =========================
             LOGIN MODE
             ========================= -->

        <ng-container *ngIf="!showForgotPassword">

          <h1>
            Login
          </h1>


          <!-- ROLE -->

          <div class="form-group">

            <label for="role">
              Login As
            </label>

            <select
              id="role"
              name="role"
              [(ngModel)]="role"
              (change)="resetFields()"
            >

              <option value="">
                Select Role
              </option>

              <option value="student">
                Student
              </option>

              <option value="warden">
                Warden
              </option>

              <option value="superintendent">
                Superintendent
              </option>

            </select>

          </div>


          <!-- WARDEN -->

          <div
            class="form-group"
            *ngIf="role === 'warden'"
          >

            <label for="selectedWarden">
              Warden
            </label>

            <select
              id="selectedWarden"
              name="selectedWarden"
              [(ngModel)]="selectedWarden"
            >

              <option value="">
                Select Warden
              </option>

              <option
                *ngFor="let warden of wardens"
                [value]="warden.name"
              >
                {{ warden.name }}
              </option>

            </select>

          </div>


          <!-- USERNAME -->

          <div class="form-group">

            <label for="username">
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              placeholder="Enter username"
              autocomplete="username"
            >

          </div>


          <!-- PASSWORD -->

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
              autocomplete="current-password"
            >

          </div>


          <!-- LOGIN BUTTON -->

          <button
            type="button"
            (click)="login()"
          >
            Login
          </button>


          <!-- FORGOT PASSWORD -->

          <button
            type="button"
            class="forgot-password-button"
            (click)="openForgotPassword()"
          >
            Forgot Password?
          </button>


          <!-- ERROR -->

          <p
            class="error"
            *ngIf="errorMessage"
          >
            {{ errorMessage }}
          </p>

        </ng-container>


        <!-- =========================
             FORGOT PASSWORD SCREEN
             ========================= -->

        <ng-container *ngIf="showForgotPassword">

          <h1>
            Forgot Password
          </h1>


          <p class="forgot-password-text">
            Enter your registered email address.
            We will send you a password reset link.
          </p>


          <!-- EMAIL -->

          <div class="form-group">

            <label for="resetEmail">
              Email Address
            </label>

            <input
              type="email"
              id="resetEmail"
              name="resetEmail"
              [(ngModel)]="resetEmail"
              placeholder="Enter registered email"
              autocomplete="email"
            >

          </div>


          <!-- SEND RESET LINK -->

          <button
            type="button"
            (click)="requestPasswordReset()"
          >
            Send Reset Link
          </button>


          <!-- BACK -->

          <button
            type="button"
            class="forgot-password-button"
            (click)="backToLogin()"
          >
            Back to Login
          </button>


          <!-- SUCCESS -->

          <p
            class="success"
            *ngIf="successMessage"
          >
            {{ successMessage }}
          </p>


          <!-- ERROR -->

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

  role = '';

  username = '';

  password = '';

  selectedWarden = '';


  // =========================
  // FORGOT PASSWORD
  // =========================

  showForgotPassword = false;

  resetEmail = '';

  successMessage = '';

  errorMessage = '';


  // =========================
  // WARDEN ACCOUNTS
  // =========================

  wardens = [

    {
      name: 'Pramila Dash',
      username: 'pramila',
      password: '1234'
    },

    {
      name: 'Parbati Mahapatra',
      username: 'parbati',
      password: '1234'
    },

    {
      name: 'Rashmi Rekha Swain',
      username: 'rashmi',
      password: '1234'
    },

    {
      name: 'Binod Manjari',
      username: 'binod',
      password: '1234'
    },

    {
      name: 'Kanaklata Jena',
      username: 'kanaklata',
      password: '1234'
    }

  ];


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  // =========================
  // RESET LOGIN FIELDS
  // =========================

  resetFields() {

    this.username = '';

    this.password = '';

    this.selectedWarden = '';

    this.errorMessage = '';

    this.successMessage = '';

  }


  // =========================
  // OPEN FORGOT PASSWORD
  // =========================

  openForgotPassword() {

    this.showForgotPassword = true;

    this.resetEmail = '';

    this.errorMessage = '';

    this.successMessage = '';

  }


  // =========================
  // BACK TO LOGIN
  // =========================

  backToLogin() {

    this.showForgotPassword = false;

    this.resetEmail = '';

    this.errorMessage = '';

    this.successMessage = '';

  }


  // =========================
  // REQUEST PASSWORD RESET
  // =========================

  requestPasswordReset() {

    this.errorMessage = '';

    this.successMessage = '';


    if (!this.resetEmail.trim()) {

      this.errorMessage =
        'Please enter your registered email address.';

      return;

    }


    const email =
      this.resetEmail
        .trim()
        .toLowerCase();


    this.http.post(
      'http://localhost:8080/password/forgot',
      null,
      {
        params: {
          email: email
        },
        responseType: 'text'
      }
    ).subscribe({

      next: (response) => {

        this.successMessage = response;

      },

      error: (error) => {

        console.error(
          'Password reset error:',
          error
        );

        if (typeof error.error === 'string') {

          this.errorMessage = error.error;

        } else {

          this.errorMessage =
            'Unable to send reset link. Please check your email address and make sure the backend is running.';

        }

      }

    });

  }


  // =========================
  // LOGIN
  // =========================

  login() {

    this.errorMessage = '';

    this.successMessage = '';


    // EMPTY FIELDS

    if (
      !this.role ||
      !this.username.trim() ||
      !this.password
    ) {

      this.errorMessage =
        'Please fill in all required fields.';

      return;

    }


    // =========================
    // STUDENT LOGIN
    // =========================

    if (this.role === 'student') {

      const studentUsername =
        this.username
          .trim()
          .toLowerCase();


      if (
        studentUsername === 'khushi' &&
        this.password === '1234'
      ) {

        localStorage.setItem(
          'loggedInRole',
          'student'
        );

        localStorage.setItem(
          'studentName',
          'Khushi'
        );

        this.router.navigate([
          '/student-dashboard'
        ]);

        return;

      }


      this.errorMessage =
        'Invalid student username or password.';

      return;

    }


    // =========================
    // WARDEN LOGIN
    // =========================

    if (this.role === 'warden') {

      if (!this.selectedWarden) {

        this.errorMessage =
          'Please select a warden.';

        return;

      }


      const selectedAccount =
        this.wardens.find(
          (warden) =>
            warden.name ===
            this.selectedWarden
        );


      if (
        selectedAccount &&
        this.username
          .trim()
          .toLowerCase() ===
        selectedAccount.username &&
        this.password ===
        selectedAccount.password
      ) {

        localStorage.setItem(
          'loggedInRole',
          'warden'
        );

        localStorage.setItem(
          'loggedInWarden',
          selectedAccount.name
        );

        this.router.navigate([
          '/warden'
        ]);

        return;

      }


      this.errorMessage =
        'Invalid warden username or password.';

      return;

    }


    // =========================
    // SUPERINTENDENT LOGIN
    // =========================

    if (
      this.role ===
      'superintendent'
    ) {

      if (
        this.username
          .trim()
          .toLowerCase() ===
        'superintendent' &&
        this.password ===
        '1234'
      ) {

        localStorage.setItem(
          'loggedInRole',
          'superintendent'
        );

        this.router.navigate([
          '/superintendent'
        ]);

        return;

      }


      this.errorMessage =
        'Invalid superintendent username or password.';

      return;

    }


    this.errorMessage =
      'Invalid login details.';

  }

}
