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
  selector: 'app-warden-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    HttpClientModule
  ],

  styleUrl: './app.css',

  template: `
    <div class="warden-dashboard">


      <!-- =========================
           HEADER
           ========================= -->

      <header class="warden-header">

        <div class="warden-header-left">

          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
            class="warden-logo"
          >

          <div>

            <h1>
              Warden Portal
            </h1>

            <p>
              Hostel Administration
            </p>

          </div>

        </div>


        <div class="warden-header-right">

          <div class="warden-profile">

            <span class="warden-profile-label">
              Logged in as
            </span>

            <strong>
              {{ loggedInWarden }}
            </strong>

          </div>


          <button
            type="button"
            class="warden-logout"
            (click)="logout()"
          >
            Logout
          </button>

        </div>

      </header>


      <!-- =========================
           MAIN CONTENT
           ========================= -->

      <main class="warden-main">


        <!-- PAGE TITLE -->

        <section class="warden-page-heading">

          <h2>
            Warden Dashboard
          </h2>

          <p>
            View and manage complaints assigned to
            {{ loggedInWarden }}.
          </p>

        </section>


        <!-- =========================
             WARDEN INFORMATION
             ========================= -->

        <section class="warden-info-card">

          <h3 class="warden-info-title">
            Warden Information
          </h3>


          <div class="warden-info-grid">

            <div class="warden-info-item">

              <span>
                Warden Name
              </span>

              <strong>
                {{ loggedInWarden }}
              </strong>

            </div>

          </div>

        </section>


        <!-- =========================
             SUMMARY
             ========================= -->

        <section class="warden-summary-grid">


          <!-- Total -->

          <div class="warden-summary-card">

            <span>
              Total Assigned
            </span>

            <strong>
              {{ filteredComplaints.length }}
            </strong>

          </div>


          <!-- Pending -->

          <div class="warden-summary-card">

            <span>
              Pending
            </span>

            <strong>
              {{ getPendingCount() }}
            </strong>

          </div>


          <!-- In Progress -->

          <div class="warden-summary-card">

            <span>
              In Progress
            </span>

            <strong>
              {{ getInProgressCount() }}
            </strong>

          </div>


          <!-- Resolved -->

          <div class="warden-summary-card">

            <span>
              Resolved
            </span>

            <strong>
              {{ getResolvedCount() }}
            </strong>

          </div>

        </section>


        <!-- =========================
             ASSIGNED COMPLAINTS
             ========================= -->

        <section class="warden-complaints-section">


          <div class="warden-section-heading">

            <div>

              <h3>
                Assigned Complaints
              </h3>

              <p>
                Complaints assigned to
                {{ loggedInWarden }}
              </p>

            </div>


            <span class="warden-complaint-count">
              {{ filteredComplaints.length }}
            </span>

          </div>


          <!-- =========================
               COMPLAINT CARDS
               ========================= -->

          <div
            class="warden-complaint-card"
            *ngFor="let complaint of filteredComplaints"
          >


            <!-- Complaint Header -->

            <div class="warden-complaint-header">

              <div class="complaint-title-group">

                <h4>
                  Complaint #{{ complaint.id }}
                </h4>

                <span class="warden-complaint-type">
                  {{ complaint.complaintType || 'General' }}
                </span>

              </div>

            </div>


            <!-- Complaint Details -->

            <div class="warden-complaint-details">


              <!-- Student -->

              <div class="warden-detail-item">

                <span>
                  Student
                </span>

                <strong>
                  {{ complaint.studentName || 'Not provided' }}
                </strong>

              </div>


              <!-- Room -->

              <div class="warden-detail-item">

                <span>
                  Room Number
                </span>

                <strong>
                  {{ complaint.roomNumber || 'Not provided' }}
                </strong>

              </div>


              <!-- Block -->

              <div class="warden-detail-item">

                <span>
                  Block
                </span>

                <strong>
                  {{ complaint.block || 'Not provided' }}
                </strong>

              </div>


              <!-- Current Status -->

              <div class="warden-detail-item">

                <span>
                  Current Status
                </span>

                <strong
                  class="status-badge"
                  [ngClass]="
                    getStatusClass(
                      complaint.status
                    )
                  "
                >
                  {{ complaint.status || 'Pending' }}
                </strong>

              </div>

            </div>


            <!-- =========================
                 DESCRIPTION
                 ========================= -->

            <div class="warden-description">

              <span class="warden-description-title">
                Complaint Description
              </span>

              <p>
                {{
                  complaint.description ||
                  'No description provided.'
                }}
              </p>

            </div>


            <!-- =========================
                 STATUS UPDATE
                 ========================= -->

            <div class="warden-status-section">

              <span class="warden-status-label">
                Update Complaint Status
              </span>


              <select
                class="warden-status-select"
                [value]="
                  complaint.status ||
                  'Pending'
                "
                (change)="
                  updateStatus(
                    complaint,
                    $event
                  )
                "
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


            <!-- =========================
                 SUPPORTING PHOTOGRAPH
                 ========================= -->

            <div
              class="warden-photo-section"
              *ngIf="complaint.photoPath"
            >

              <span>
                Supporting Photograph
              </span>

              <a
                [href]="
                  'http://localhost:8080/complaints/photo/' +
                  complaint.photoPath
                "
                target="_blank"
              >
                View Photograph
              </a>

            </div>


            <div
              class="warden-no-photo"
              *ngIf="!complaint.photoPath"
            >
              No supporting photograph attached.
            </div>

          </div>


          <!-- =========================
               EMPTY STATE
               ========================= -->

          <div
            class="warden-empty-state"
            *ngIf="
              filteredComplaints.length === 0
            "
          >

            <h3>
              No Complaints Assigned
            </h3>

            <p>
              There are currently no complaints
              assigned to {{ loggedInWarden }}.
            </p>

          </div>

        </section>

      </main>


      <!-- =========================
           FOOTER
           ========================= -->

      <footer class="warden-footer">

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


export class WardenDashboardComponent
  implements OnInit {


  complaints: any[] = [];

  filteredComplaints: any[] = [];

  loggedInWarden = '';


  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {

    this.loggedInWarden =
      localStorage.getItem(
        'loggedInWarden'
      ) || '';

    this.loadComplaints();

  }


  loadComplaints() {

    this.http
      .get<any[]>(
        'http://localhost:8080/complaints'
      )
      .subscribe({

        next: (data) => {

          this.complaints = data;

          this.filterComplaints();

          this.cdr.detectChanges();

          console.log(
            'Logged-in Warden:',
            this.loggedInWarden
          );

          console.log(
            'Assigned complaints:',
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


    const loggedWarden =
      this.loggedInWarden
        .trim()
        .toLowerCase();


    this.filteredComplaints =
      this.complaints.filter(
        (complaint) => {

          const complaintWarden =
            (
              complaint.warden || ''
            )
              .trim()
              .toLowerCase();


          return (
            complaintWarden ===
            loggedWarden
          );

        }
      );

  }


  getPendingCount(): number {

    return this.filteredComplaints
      .filter(
        (complaint) =>
          (
            complaint.status ||
            'Pending'
          )
            .trim()
            .toLowerCase() ===
          'pending'
      )
      .length;

  }


  getInProgressCount(): number {

    return this.filteredComplaints
      .filter(
        (complaint) =>
          (
            complaint.status ||
            ''
          )
            .trim()
            .toLowerCase() ===
          'in progress'
      )
      .length;

  }


  getResolvedCount(): number {

    return this.filteredComplaints
      .filter(
        (complaint) =>
          (
            complaint.status ||
            ''
          )
            .trim()
            .toLowerCase() ===
          'resolved'
      )
      .length;

  }


  getStatusClass(
    status: string
  ): string {

    const currentStatus =
      (
        status ||
        'Pending'
      )
        .trim()
        .toLowerCase();


    if (
      currentStatus ===
      'resolved'
    ) {

      return 'status-resolved';

    }


    if (
      currentStatus ===
      'in progress'
    ) {

      return 'status-progress';

    }


    return 'status-pending';

  }


  updateStatus(
    complaint: any,
    event: Event
  ) {

    const select =
      event.target as HTMLSelectElement;


    const newStatus =
      select.value;


    this.http
      .put<any>(
        `http://localhost:8080/complaints/${complaint.id}/status?status=${encodeURIComponent(newStatus)}`,
        {}
      )
      .subscribe({

        next: (updatedComplaint) => {

          complaint.status =
            updatedComplaint.status;


          this.cdr.detectChanges();


          console.log(
            'Complaint status updated:',
            updatedComplaint
          );

        },


        error: (error) => {

          console.error(
            'Error updating complaint status:',
            error
          );


          alert(
            'Failed to update complaint status.'
          );


          select.value =
            complaint.status ||
            'Pending';

        }

      });

  }


  logout() {

    localStorage.removeItem(
      'loggedInRole'
    );

    localStorage.removeItem(
      'loggedInWarden'
    );


    this.router.navigate([
      '/login'
    ]);

  }

}
