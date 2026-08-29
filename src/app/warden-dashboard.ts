import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-warden-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  styleUrl: './app.css',
  template: `
    <div class="dashboard">

      <!-- Header -->
      <header class="dashboard-header">
        <div>
          <h1>Hostel Complaint Management System</h1>
          <p>Warden Dashboard</p>
        </div>

        <div class="hostel-name">
          <strong>{{ hostelName }}</strong>
        </div>
      </header>

      <!-- Warden Selection -->
      <section class="dashboard-section">
        <h2>Warden Information</h2>

        <div class="warden-select">
          <label for="warden">
            Select Warden
          </label>

          <select
            id="warden"
            name="warden"
            [(ngModel)]="selectedWarden"
            (change)="filterComplaints()"
          >
            <option value="">Select Warden</option>

            <option
              *ngFor="let warden of wardens"
              [value]="warden"
            >
              {{ warden }}
            </option>
          </select>
        </div>

        <div
          class="warden-contact"
          *ngIf="selectedWarden"
        >
          <div>
            <span class="label">Warden</span>
            <strong>{{ selectedWarden }}</strong>
          </div>

          <div>
            <span class="label">Contact Number</span>
            <strong>{{ getWardenPhone() }}</strong>
          </div>
        </div>
      </section>

      <!-- Contact Administration -->
      <section class="contact-section">
        <h2>Need Help?</h2>
        <p>
          For assistance regarding hostel complaints,
          contact the hostel administration.
        </p>

        <div class="contact-details">
          <span>
            <strong>Hostel Email:</strong>
            {{ hostelEmail }}
          </span>
        </div>
      </section>

      <!-- Complaint Section -->
      <section class="dashboard-section">

        <div class="section-heading">
          <div>
            <h2>Assigned Complaints</h2>

            <p *ngIf="selectedWarden">
              Complaints assigned to {{ selectedWarden }}
            </p>

            <p *ngIf="!selectedWarden">
              Select a warden to view assigned complaints.
            </p>
          </div>

          <div
            class="complaint-count"
            *ngIf="selectedWarden"
          >
            {{ filteredComplaints.length }}
          </div>
        </div>

        <!-- Complaint Cards -->
        <div
          class="complaint-card"
          *ngFor="let complaint of filteredComplaints"
        >

          <div class="complaint-header">
            <h3>Complaint #{{ complaint.id }}</h3>

            <span class="complaint-type">
              {{ complaint.complaintType || 'General' }}
            </span>
          </div>

          <div class="complaint-details">

            <div>
              <span class="label">Student</span>
              <strong>
                {{ complaint.studentName || 'Not provided' }}
              </strong>
            </div>

            <div>
              <span class="label">Room Number</span>
              <strong>
                {{ complaint.roomNumber || 'Not provided' }}
              </strong>
            </div>

            <div>
              <span class="label">Block</span>
              <strong>
                {{ complaint.block || 'Not provided' }}
              </strong>
            </div>

            <div>
              <span class="label">Superintendent</span>
              <strong>
                {{ complaint.superintendent || 'Not sent' }}
              </strong>
            </div>

          </div>

          <div class="description">
            <span class="label">Description</span>
            <p>
              {{ complaint.description || 'No description provided.' }}
            </p>
          </div>

          <div
            class="photo-section"
            *ngIf="complaint.photoPath"
          >
            <span class="label">Supporting Photograph</span>

            <a
              [href]="'http://localhost:8080/complaints/photo/' + complaint.photoPath.split('/').pop()"
              target="_blank"
            >
              View Photograph
            </a>
          </div>

          <div
            class="no-photo"
            *ngIf="!complaint.photoPath"
          >
            No photograph attached
          </div>

        </div>

        <!-- No Complaints -->
        <div
          class="empty-state"
          *ngIf="selectedWarden && filteredComplaints.length === 0"
        >
          <h3>No Complaints Assigned</h3>
          <p>
            There are currently no complaints assigned to
            {{ selectedWarden }}.
          </p>
        </div>

      </section>

    </div>
  `
})
export class WardenDashboardComponent implements OnInit {

  complaints: any[] = [];
  filteredComplaints: any[] = [];

  selectedWarden = '';

  hostelName = 'Block B Hostel';
  hostelEmail = 'hostel@college.edu';

  wardens = [
    'Pramila Dash',
    'Parbati Mahapatra',
    'Rashmi Rekha Swain',
    'Binod Manjari',
    'Kanaklata Jena'
  ];

  wardenPhones: { [key: string]: string } = {
    'Pramila Dash': '9XXXXXXXXX',
    'Parbati Mahapatra': '9XXXXXXXXX',
    'Rashmi Rekha Swain': '9XXXXXXXXX',
    'Binod Manjari': '9XXXXXXXXX',
    'Kanaklata Jena': '9XXXXXXXXX'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadComplaints();
  }

  loadComplaints() {
    this.http.get<any[]>(
      'http://localhost:8080/complaints'
    ).subscribe({
      next: (data) => {
        this.complaints = data;
        console.log('All complaints:', this.complaints);
      },

      error: (error) => {
        console.error('Error loading complaints:', error);
      }
    });
  }

  filterComplaints() {

    if (!this.selectedWarden) {
      this.filteredComplaints = [];
      return;
    }

    this.filteredComplaints = this.complaints.filter(
      complaint => complaint.warden === this.selectedWarden
    );

    console.log(
      'Complaints for',
      this.selectedWarden,
      ':',
      this.filteredComplaints
    );
  }

  getWardenPhone(): string {
    return this.wardenPhones[this.selectedWarden] || 'Not available';
  }
}
