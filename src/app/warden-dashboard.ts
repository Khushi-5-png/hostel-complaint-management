import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-warden-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
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


      <!-- Warden Information -->
      <section class="dashboard-section">

        <h2>Warden Information</h2>

        <div class="warden-contact">

          <div>
            <span class="label">Warden</span>
            <strong>{{ loggedInWarden }}</strong>
          </div>

          <div>
            <span class="label">Contact Number</span>
            <strong>{{ getWardenPhone() }}</strong>
          </div>

        </div>

      </section>


      <!-- Need Help -->
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


      <!-- Assigned Complaints -->
      <section class="dashboard-section">

        <div class="section-heading">

          <div>
            <h2>Assigned Complaints</h2>

            <p>
              Complaints assigned to {{ loggedInWarden }}
            </p>
          </div>

          <div class="complaint-count">
            {{ filteredComplaints.length }}
          </div>

        </div>


        <!-- Complaint Cards -->
        <div
          class="complaint-card"
          *ngFor="let complaint of filteredComplaints"
        >

          <div class="complaint-header">

            <h3>
              Complaint #{{ complaint.id }}
            </h3>

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
              <span class="label">Status</span>
              <strong>
                {{ complaint.status || 'Pending' }}
              </strong>
            </div>

          </div>


          <!-- Description -->
          <div class="description">

            <span class="label">
              Description
            </span>

            <p>
              {{ complaint.description || 'No description provided.' }}
            </p>

          </div>


          <!-- Status Update -->
          <div class="status-update">

            <span class="label">
              Update Complaint Status
            </span>

            <div class="status-controls">

              <select
                [value]="complaint.status || 'Pending'"
                (change)="onStatusChange(complaint, $event)"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>

            </div>

          </div>


          <!-- Photo -->
          <div
            class="photo-section"
            *ngIf="complaint.photoPath"
          >

            <span class="label">
              Supporting Photograph
            </span>

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
          *ngIf="filteredComplaints.length === 0"
        >

          <h3>No Complaints Assigned</h3>

          <p>
            There are currently no complaints assigned to
            {{ loggedInWarden }}.
          </p>

        </div>

      </section>

    </div>
  `
})
export class WardenDashboardComponent implements OnInit {

  complaints: any[] = [];
  filteredComplaints: any[] = [];

  loggedInWarden = '';

  hostelName = 'Block B Hostel';
  hostelEmail = 'hostel@college.edu';

  wardenPhones: { [key: string]: string } = {
    'Pramila Dash': '9XXXXXXXXX',
    'Parbati Mahapatra': '9XXXXXXXXX',
    'Rashmi Rekha Swain': '9XXXXXXXXX',
    'Binod Manjari': '9XXXXXXXXX',
    'Kanaklata Jena': '9XXXXXXXXX'
  };

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.loggedInWarden =
      localStorage.getItem('loggedInWarden') || '';

    this.loadComplaints();
  }


  loadComplaints() {

    this.http.get<any[]>(
      'http://localhost:8080/complaints'
    ).subscribe({

      next: (data) => {

        this.complaints = data;

        this.filterComplaints();

        console.log(
          'Logged-in warden:',
          this.loggedInWarden
        );

        console.log(
          'Warden complaints:',
          this.filteredComplaints
        );

      },

      error: (error) => {

        console.error(
          'Error loading complaints:',
          error
        );

      }

    });
  }


  filterComplaints() {

    if (!this.loggedInWarden) {
      this.filteredComplaints = [];
      return;
    }

    this.filteredComplaints =
      this.complaints.filter(
        complaint =>
          (complaint.warden || '')
            .trim()
            .toLowerCase() ===
          this.loggedInWarden
            .trim()
            .toLowerCase()
      );
  }


  getWardenPhone(): string {

    return (
      this.wardenPhones[this.loggedInWarden] ||
      'Not available'
    );
  }


  onStatusChange(
    complaint: any,
    event: Event
  ) {

    const select =
      event.target as HTMLSelectElement;

    const newStatus =
      select.value;

    this.http.put<any>(
      `http://localhost:8080/complaints/${complaint.id}/status?status=${encodeURIComponent(newStatus)}`,
      {}
    ).subscribe({

      next: (updatedComplaint) => {

        complaint.status =
          updatedComplaint.status;

        console.log(
          'Status updated:',
          updatedComplaint
        );

      },

      error: (error) => {

        console.error(
          'Error updating status:',
          error
        );

        alert(
          'Failed to update complaint status.'
        );
      }

    });
  }
}
