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

        <h1>Hostel Management Login</h1>

        <p class="subtitle">
          Hostel Complaint Management System
        </p>


        <!-- Role -->
        <div class="form-group">

          <label for="role">
            Login As
          </label>

          <select
            id="role"
            name="role"
            [(ngModel)]="role"
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


        <!-- Warden Selection -->
        <div
          class="form-group"
          *ngIf="role === 'warden'"
        >

          <label for="warden">
            Select Warden
          </label>

          <select
            id="warden"
            name="warden"
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
          >

        </div>


        <!-- Login -->
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


  login() {

    this.errorMessage = '';

    if (
      !this.role ||
      !this.username ||
      !this.password
    ) {

      this.errorMessage =
        'Please fill in all required fields.';

      return;
    }


    // Student Login
    if (
      this.role === 'student' &&
      this.username.toLowerCase() === 'khushi' &&
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


    // Warden Login
    if (this.role === 'warden') {

      if (!this.selectedWarden) {

        this.errorMessage =
          'Please select a warden.';

        return;
      }

      if (
        this.username === 'warden' &&
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


    // Superintendent Login
    if (
      this.role === 'superintendent' &&
      this.username === 'superintendent' &&
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
      'Invalid username or password.';
  }
}
