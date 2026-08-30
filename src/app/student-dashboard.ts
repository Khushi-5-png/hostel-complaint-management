import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  styleUrl: './app.css',
  template: `
    <div class="dashboard">

      <header class="dashboard-header">
        <div>
          <h1>Hostel Complaint Management System</h1>
          <p>Student Dashboard</p>
        </div>

        <div class="hostel-name">
          <strong>Block B Hostel</strong>
        </div>
      </header>

      <main class="dashboard-section">

        <div class="section-heading">
          <div>
            <h2>My Complaints</h2>
            <p>
              Complaints submitted by {{ studentName }}
            </p>
          </div>

          <div class="complaint-count">
            {{ complaintCount }}
          </div>
        </div>


        <!-- Complaints -->
        <div
          class="complaints-list"
          *ngIf="complaintCount > 0"
        >

          <div
            class="complaint-card"
            *ngFor="let complaint of complaints"
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
                <span class="label">Warden</span>
                <strong>
                  {{ complaint.warden || 'Not assigned' }}
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

              <span class="label">
                Description
              </span>

              <p>
                {{ complaint.description || 'No description provided.' }}
              </p>

            </div>


            <div class="status-section">

              <span class="label">
                Status
              </span>

              <span class="status-badge">
                Pending
              </span>

            </div>


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

        </div>


        <!-- No complaints -->
        <div
          class="empty-state"
          *ngIf="complaintCount === 0"
        >

          <h3>No Complaints Found</h3>

          <p>
            No complaints have been submitted by
            {{ studentName }}.
          </p>

        </div>

      </main>

    </div>
  `
})
export class StudentDashboardComponent implements OnInit {

  complaints: any[] = [];
  complaintCount = 0;
  studentName = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.studentName =
      localStorage.getItem('studentName') || '';

    console.log(
      'Logged-in student:',
      this.studentName
    );

    this.loadComplaints();
  }

  loadComplaints() {

    this.http.get<any[]>(
      'http://localhost:8080/complaints'
    ).subscribe({

      next: (data) => {

        const loggedInStudent =
          this.studentName.trim().toLowerCase();

        const filteredComplaints = data.filter(
          complaint => {

            const complaintStudent =
              (complaint.studentName || '')
                .trim()
                .toLowerCase();

            return complaintStudent === loggedInStudent;
          }
        );

        this.complaints = [
          ...filteredComplaints
        ];

        this.complaintCount =
          this.complaints.length;

        console.log(
          'Filtered complaints:',
          this.complaints
        );

        console.log(
          'Complaint count:',
          this.complaintCount
        );

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error loading complaints:',
          error
        );

      }

    });
  }
}
