import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './app.css',
  template: `
    <div class="help-page">

      <header class="help-header">
        <div>
          <h1>Hostel Complaint Management System</h1>
          <p>Help & Contact Administration</p>
        </div>

        <div class="help-hostel">
          <span>Hostel</span>
          <strong>Block B Hostel</strong>
        </div>
      </header>

      <main class="help-main">

        <div class="help-title">
          <h2>Help & Contact Administration</h2>
          <p>
            Contact the appropriate hostel authority for assistance
            regarding complaints or hostel facilities.
          </p>
        </div>

        <section class="help-card">

          <h3>Hostel Administration</h3>

          <div class="contact-row">
            <span>Hostel Email</span>
            <strong>hostel@college.edu</strong>
          </div>

        </section>

        <section class="help-card">

          <h3>Wardens</h3>

          <div class="contact-list">

            <div class="contact-item">
              <span>Pramila Dash</span>
              <strong>9XXXXXXXXX</strong>
            </div>

            <div class="contact-item">
              <span>Parbati Mahapatra</span>
              <strong>9XXXXXXXXX</strong>
            </div>

            <div class="contact-item">
              <span>Rashmi Rekha Swain</span>
              <strong>9XXXXXXXXX</strong>
            </div>

            <div class="contact-item">
              <span>Binod Manjari</span>
              <strong>9XXXXXXXXX</strong>
            </div>

            <div class="contact-item">
              <span>Kanaklata Jena</span>
              <strong>9XXXXXXXXX</strong>
            </div>

          </div>

        </section>

        <section class="help-card">

          <h3>Superintendent</h3>

          <div class="contact-row">
            <span>Basanta Manjari Dash</span>
            <strong>9XXXXXXXXX</strong>
          </div>

        </section>

        <section class="help-card">

          <h3>Complaint Assistance</h3>

          <p>
            For routine hostel complaints, submit the complaint
            through the Student Complaint Portal.
          </p>

          <p>
            For urgent hostel-related issues, contact your assigned
            warden directly.
          </p>

        </section>

      </main>

    </div>
  `
})
export class HelpComponent {
}
