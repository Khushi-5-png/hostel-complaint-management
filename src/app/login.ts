import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './app.css',

  template: `
    <div class="login-container">

      <div class="login-card">

        <!-- Centurion University Logo -->
        <div class="login-logo">
          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
          >
        </div>

        <h1>Login</h1>


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
              [value]="warden"
            >
              {{ warden }}
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
          >

        </div>


        <!-- LOGIN -->
        <button
          type="button"
          (click)="login()"
        >
          Login
        </button>


        <!-- ERROR -->
        <p
          class="error"
          *ngIf="errorMessage"
        >
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

  selectedWarden = '';

  errorMessage = '';


  wardens = [
    'Pramila Dash',
    'Parbati Mahapatra',
    'Rashmi Rekha Swain',
    'Binod Manjari',
    'Kanaklata Jena'
  ];


  constructor(
    private router: Router
  ) {}


  resetFields() {

    this.username = '';
    this.password = '';
    this.selectedWarden = '';
    this.errorMessage = '';

  }


  login() {

    this.errorMessage = '';


    // Empty fields
    if (
      !this.role ||
      !this.username ||
      !this.password
    ) {

      this.errorMessage =
        'Please fill in all required fields.';

      return;

    }


    // =========================
    // STUDENT
    // =========================

    if (this.role === 'student') {

      if (
        this.username.trim().toLowerCase() === 'khushi' &&
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
    // WARDEN
    // =========================

    if (this.role === 'warden') {

      if (!this.selectedWarden) {

        this.errorMessage =
          'Please select a warden.';

        return;

      }


      if (
        this.username.trim().toLowerCase() ===
        'warden' &&
        this.password === '1234'
      ) {

        localStorage.setItem(
          'loggedInRole',
          'warden'
        );

        localStorage.setItem(
          'loggedInWarden',
          this.selectedWarden
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
    // SUPERINTENDENT
    // =========================

    if (this.role === 'superintendent') {

      if (
        this.username.trim().toLowerCase() ===
        'superintendent' &&
        this.password === '1234'
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
