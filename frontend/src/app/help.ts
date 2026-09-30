import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './app.css',

  template: `
    <div class="help-page">

      <!-- =========================
           HEADER
           ========================= -->

      <header class="help-header">

        <div class="help-brand">

          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
            class="help-logo"
          >

          <div class="help-brand-text">

            <h1>
              Help & Contact
            </h1>

            <p>
              Hostel Administration
            </p>

          </div>

        </div>


        <div class="help-hostel">

          <span>
            Hostel
          </span>

          <strong>
            Block B Hostel
          </strong>

        </div>

      </header>


      <!-- =========================
           MAIN
           ========================= -->

      <main class="help-main">

        <section class="help-introduction">

          <h2>
            Help & Contact Information
          </h2>

          <p>
            Please contact the appropriate hostel authority
            for assistance regarding hostel facilities,
            complaints, or urgent hostel-related matters.
          </p>

        </section>


        <!-- =========================
             HOSTEL ADMINISTRATION
             ========================= -->

        <section class="help-card">

          <h3>
            Hostel Administration
          </h3>

          <div class="contact-row">

            <span>
              Official Hostel Email
            </span>

            <strong>
              hostel@college.edu
            </strong>

          </div>

        </section>


        <!-- =========================
             WARDENS
             ========================= -->

        <section class="help-card">

          <h3>
            Warden Contacts
          </h3>

          <p class="section-note">
            Contact your assigned warden for
            routine hostel-related issues.
          </p>

          <div class="contact-list">

            <div class="contact-item">

              <span>
                Pramila Dash
              </span>

              <strong>
                Contact number to be added
              </strong>

            </div>


            <div class="contact-item">

              <span>
                Parbati Mahapatra
              </span>

              <strong>
                Contact number to be added
              </strong>

            </div>


            <div class="contact-item">

              <span>
                Rashmi Rekha Swain
              </span>

              <strong>
                Contact number to be added
              </strong>

            </div>


            <div class="contact-item">

              <span>
                Binod Manjari
              </span>

              <strong>
                Contact number to be added
              </strong>

            </div>


            <div class="contact-item">

              <span>
                Kanaklata Jena
              </span>

              <strong>
                Contact number to be added
              </strong>

            </div>

          </div>

        </section>


        <!-- =========================
             SUPERINTENDENT
             ========================= -->

        <section class="help-card">

          <h3>
            Superintendent
          </h3>

          <div class="contact-row">

            <span>
              Basanta Manjari Dash
            </span>

            <strong>
              9938874573
            </strong>

          </div>

        </section>


        <!-- =========================
             COMPLAINT ASSISTANCE
             ========================= -->

        <section class="help-card">

          <h3>
            Complaint Assistance
          </h3>

          <div class="assistance-box">

            <p>
              For routine complaints, please submit your
              complaint through the Student Complaint Portal.
            </p>

            <p>
              For urgent hostel-related issues, contact
              your assigned warden or the Superintendent.
            </p>

          </div>

        </section>


        <!-- =========================
             BACK
             ========================= -->

        <div class="help-actions">

          <button
            type="button"
            class="help-back-button"
            (click)="goBack()"
          >
            Back to Complaint Portal
          </button>

        </div>

      </main>


      <!-- =========================
           FOOTER
           ========================= -->

      <footer class="student-footer">

        <p>
          Centurion University of Technology and Management
        </p>

        <span>
          Hostel Administration
        </span>

      </footer>

    </div>
  `
})

export class HelpComponent {

  constructor(
    private router: Router
  ) {}


  goBack() {

    this.router.navigate(['/']);

  }

}
