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


        <!-- Heading -->
        <h1>
          Login
        </h1>


        <!-- Role -->
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


        <!-- Warden -->
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


        <!-- Username -->
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


        <!-- Password -->
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


        <!-- Login Button -->
        <button
          type="button"
          (click)="login()"
        >
          Login
        </button>


        <!-- Error -->
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


  /*
   * Temporary demo accounts.
   * We will move authentication to Spring Boot later.
   */
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


    // =========================
    // EMPTY FIELDS
    // =========================

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
