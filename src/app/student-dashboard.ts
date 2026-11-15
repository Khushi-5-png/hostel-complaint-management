import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import { Router } from '@angular/router';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    HttpClientModule
  ],

  styleUrl: './app.css',

  template: `
    <div class="student-dashboard">

      <!-- =========================
           HEADER
           ========================= -->

      <header class="student-header">

        <div class="student-header-left">

          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
            class="student-logo"
          >

          <div>
            <h1>
              Hostel Complaint Management System
            </h1>

            <p>
              Student Portal
            </p>
          </div>

        </div>


        <div class="student-header-right">

          <div class="student-profile">

            <span class="profile-label">
              Logged in as
            </span>

            <strong>
              {{ studentName }}
            </strong>

          </div>


          <button
            class="logout-button"
            type="button"
            (click)="logout()"
          >
            Logout
          </button>

        </div>

      </header>


      <!-- =========================
           MAIN CONTENT
           ========================= -->

      <main class="student-main">

        <!-- Page Heading -->
        <section class="student-page-heading">

          <div>

            <h2>
              Student Dashboard
            </h2>

            <p>
              Welcome, {{ studentName }}.
              View and monitor your hostel complaints.
            </p>

          </div>


          <button
            class="new-complaint-button"
            type="button"
            (click)="raiseComplaint()"
          >
            Raise New Complaint
          </button>

        </section>


        <!-- =========================
             SUMMARY CARDS
             ========================= -->

        <section class="summary-grid">

          <div class="summary-card">

            <div class="summary-card-content">

              <span class="summary-label">
                Total Complaints
              </span>

              <strong>
                {{ complaints.length }}
              </strong>

            </div>

          </div>


          <div class="summary-card">

            <div class="summary-card-content">

              <span class="summary-label">
                Pending
              </span>

              <strong>
                {{ getPendingCount() }}
              </strong>

            </div>

          </div>


          <div class="summary-card">

            <div class="summary-card-content">

              <span class="summary-label">
                In Progress
              </span>

              <strong>
                {{ getInProgressCount() }}
              </strong>

            </div>

          </div>


          <div class="summary-card">

            <div class="summary-card-content">

              <span class="summary-label">
                Resolved
              </span>

              <strong>
                {{ getResolvedCount() }}
              </strong>

            </div>

          </div>

        </section>


        <!-- =========================
             MY COMPLAINTS
             ========================= -->

        <section class="complaints-section">

          <div class="section-heading">

            <div>

              <h3>
                My Complaints
              </h3>

              <p>
                Complaints submitted by {{ studentName }}
              </p>

            </div>


            <span class="complaint-total">
              {{ complaints.length }}
            </span>

          </div>


          <!-- Complaint Table -->

          <div
            class="complaint-table"
            *ngIf="complaints.length > 0"
          >

            <!-- Header -->

            <div class="complaint-table-header">

              <div>
                Complaint ID
              </div>

              <div>
                Category
              </div>

              <div>
                Room
              </div>

              <div>
                Warden
              </div>

              <div>
                Status
              </div>

              <div>
                Action
              </div>

            </div>


            <!-- Rows -->

            <div
              class="complaint-table-row"
              *ngFor="let complaint of complaints"
            >

              <!-- ID -->

              <div>

                <span class="mobile-label">
                  Complaint ID
                </span>

                <strong>
                  #{{ complaint.id }}
                </strong>

              </div>


              <!-- Category -->

              <div>

                <span class="mobile-label">
                  Category
                </span>

                <span>
                  {{ complaint.complaintType || 'General' }}
                </span>

              </div>


              <!-- Room -->

              <div>

                <span class="mobile-label">
                  Room
                </span>

                <span>
                  {{ complaint.roomNumber || '—' }}
                </span>

              </div>


              <!-- Warden -->

              <div>

                <span class="mobile-label">
                  Warden
                </span>

                <span>
                  {{ complaint.warden || 'Not assigned' }}
                </span>

              </div>


              <!-- Status -->

              <div>

                <span class="mobile-label">
                  Status
                </span>

                <span
                  class="status-badge"
                  [ngClass]="
                    getStatusClass(complaint.status)
                  "
                >
                  {{ complaint.status || 'Pending' }}
                </span>

              </div>


              <!-- Action -->

              <div>

                <span class="mobile-label">
                  Action
                </span>

                <button
                  type="button"
                  class="view-button"
                  (click)="viewComplaint(complaint)"
                >
                  View
                </button>

              </div>

            </div>

          </div>


          <!-- Empty State -->

          <div
            class="student-empty-state"
            *ngIf="complaints.length === 0"
          >

            <h3>
              No Complaints Found
            </h3>

            <p>
              You have not submitted any complaints yet.
            </p>

            <button
              type="button"
              class="new-complaint-button"
              (click)="raiseComplaint()"
            >
              Raise Your First Complaint
            </button>

          </div>

        </section>


        <!-- =========================
             COMPLAINT DETAILS
             ========================= -->

        <section
          class="complaint-detail-section"
          *ngIf="selectedComplaint"
        >

          <div class="section-heading">

            <div>

              <h3>
                Complaint #{{ selectedComplaint.id }}
              </h3>

              <p>
                Complaint details
              </p>

            </div>


            <button
              type="button"
              class="close-detail-button"
              (click)="closeComplaint()"
            >
              Close
            </button>

          </div>


          <div class="complaint-detail-card">

            <div class="detail-grid">

              <!-- Complaint Type -->

              <div class="detail-item">

                <span>
                  Complaint Type
                </span>

                <strong>
                  {{
                    selectedComplaint.complaintType ||
                    'General'
                  }}
                </strong>

              </div>


              <!-- Room -->

              <div class="detail-item">

                <span>
                  Room Number
                </span>

                <strong>
                  {{ selectedComplaint.roomNumber || '—' }}
                </strong>

              </div>


              <!-- Block -->

              <div class="detail-item">

                <span>
                  Block
                </span>

                <strong>
                  {{ selectedComplaint.block || '—' }}
                </strong>

              </div>


              <!-- Warden -->

              <div class="detail-item">

                <span>
                  Assigned Warden
                </span>

                <strong>
                  {{
                    selectedComplaint.warden ||
                    'Not assigned'
                  }}
                </strong>

              </div>


              <!-- Superintendent -->

              <div class="detail-item">

                <span>
                  Superintendent
                </span>

                <strong>
                  {{
                    selectedComplaint.superintendent ||
                    'Not sent'
                  }}
                </strong>

              </div>


              <!-- Status -->

              <div class="detail-item">

                <span>
                  Status
                </span>

                <strong
                  class="status-badge"
                  [ngClass]="
                    getStatusClass(
                      selectedComplaint.status
                    )
                  "
                >
                  {{
                    selectedComplaint.status ||
                    'Pending'
                  }}
                </strong>

              </div>

            </div>


            <!-- Description -->

            <div class="description-block">

              <span>
                Complaint Description
              </span>

              <p>
                {{
                  selectedComplaint.description ||
                  'No description provided.'
                }}
              </p>

            </div>


            <!-- Photograph -->

            <div
              class="photo-section"
              *ngIf="selectedComplaint.photoPath"
            >

              <span>
                Supporting Photograph
              </span>

              <a
                [href]="
                  'http://localhost:8080/complaints/photo/' +
                  selectedComplaint.photoPath
                    .split('/')
                    .pop()
                "
                target="_blank"
              >
                View Supporting Photograph
              </a>

            </div>


            <div
              class="no-photo"
              *ngIf="!selectedComplaint.photoPath"
            >
              No supporting photograph attached.
            </div>

          </div>

        </section>

      </main>


      <!-- =========================
           FOOTER
           ========================= -->

      <footer class="student-footer">

        <p>
          Centurion University of Technology and Management
        </p>

        <span>
          Hostel Complaint Management System
        </span>

      </footer>

    </div>
  `
})


export class StudentDashboardComponent
  implements OnInit {

  complaints: any[] = [];

  studentName = '';

  selectedComplaint: any = null;


  constructor(
    private http: HttpClient,
    private router: Router,
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
          this.studentName
            .trim()
            .toLowerCase();


        this.complaints =
          data.filter((complaint) => {

            const complaintStudent =
              (complaint.studentName || '')
                .trim()
                .toLowerCase();

            return complaintStudent ===
              loggedInStudent;

          });


        console.log(
          'Filtered complaints:',
          this.complaints
        );


        console.log(
          'Complaint count:',
          this.complaints.length
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


  getPendingCount(): number {

    return this.complaints.filter(
      (complaint) =>
        (complaint.status || 'Pending')
          .trim()
          .toLowerCase() ===
        'pending'
    ).length;

  }


  getInProgressCount(): number {

    return this.complaints.filter(
      (complaint) =>
        (complaint.status || '')
          .trim()
          .toLowerCase() ===
        'in progress'
    ).length;

  }


  getResolvedCount(): number {

    return this.complaints.filter(
      (complaint) =>
        (complaint.status || '')
          .trim()
          .toLowerCase() ===
        'resolved'
    ).length;

  }


  getStatusClass(
    status: string
  ): string {

    const currentStatus =
      (status || 'Pending')
        .trim()
        .toLowerCase();


    if (currentStatus === 'resolved') {
      return 'status-resolved';
    }


    if (currentStatus === 'in progress') {
      return 'status-progress';
    }


    return 'status-pending';
  }


  viewComplaint(
    complaint: any
  ) {

    this.selectedComplaint =
      complaint;


    setTimeout(() => {

      const element =
        document.querySelector(
          '.complaint-detail-section'
        );

      if (element) {

        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }

    }, 100);

  }


  closeComplaint() {

    this.selectedComplaint =
      null;
  }


  raiseComplaint() {

    this.router.navigate(['/']);
  }


  logout() {

    localStorage.removeItem(
      'loggedInRole'
    );

    localStorage.removeItem(
      'studentName'
    );

    this.router.navigate([
      '/login'
    ]);

  }

}
