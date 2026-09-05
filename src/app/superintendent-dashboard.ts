import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superintendent-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  styleUrl: './app.css',

  template: `
    <div class="superintendent-dashboard">

      <!-- HEADER -->
      <header class="superintendent-header">

        <div class="superintendent-header-left">

          <img
            src="/centurion-logo.jpg"
            alt="Centurion University Logo"
            class="superintendent-logo"
          >

          <div>
            <h1>Superintendent Portal</h1>
            <p>Hostel Administration</p>
          </div>

        </div>

        <div class="superintendent-header-right">

          <div class="superintendent-profile">

            <span class="superintendent-profile-label">
              Logged in as
            </span>

            <strong>
              {{ superintendentName }}
            </strong>

          </div>

          <button
            class="superintendent-logout"
            type="button"
            (click)="logout()"
          >
            Logout
          </button>

        </div>

      </header>


      <!-- MAIN -->
      <main class="superintendent-main">

        <!-- PAGE HEADING -->
        <section class="superintendent-page-heading">

          <h2>
            Superintendent Dashboard
          </h2>

          <p>
            Review complaints escalated to the Superintendent
          </p>

        </section>


        <!-- SUPERINTENDENT INFORMATION -->
        <section class="superintendent-info-card">

          <h3 class="superintendent-info-title">
            Superintendent Information
          </h3>

          <div class="superintendent-info-grid">

            <div class="superintendent-info-item">

              <span>
                Superintendent Name
              </span>

              <strong>
                {{ superintendentName }}
              </strong>

            </div>

          </div>

        </section>


        <!-- SUMMARY -->
        <section class="superintendent-summary-grid">

          <!-- TOTAL -->
          <div class="superintendent-summary-card">

            <span>
              Total Complaints
            </span>

            <strong>
              {{ complaints.length }}
            </strong>

          </div>


          <!-- PENDING -->
          <div class="superintendent-summary-card">

            <span>
              Pending
            </span>

            <strong>
              {{ getPendingCount() }}
            </strong>

          </div>


          <!-- IN PROGRESS -->
          <div class="superintendent-summary-card">

            <span>
              In Progress
            </span>

            <strong>
              {{ getInProgressCount() }}
            </strong>

          </div>


          <!-- RESOLVED -->
          <div class="superintendent-summary-card">

            <span>
              Resolved
            </span>

            <strong>
              {{ getResolvedCount() }}
            </strong>

          </div>

        </section>


        <!-- ESCALATED COMPLAINTS -->
        <section class="superintendent-complaints-section">

          <!-- SECTION HEADER -->
          <div class="superintendent-section-heading">

            <div>

              <h3>
                Escalated Complaints
              </h3>

              <p>
                Complaints requiring Superintendent attention
              </p>

            </div>

            <div class="superintendent-complaint-count">
              {{ complaints.length }}
            </div>

          </div>


          <!-- COMPLAINTS -->
          <div
            class="superintendent-complaint-card"
            *ngFor="let complaint of complaints"
          >

            <!-- COMPLAINT HEADER -->
            <div class="superintendent-complaint-header">

              <h4>
                Complaint #{{ complaint.id }}
              </h4>

              <span class="superintendent-complaint-type">
                {{ complaint.complaintType || 'Not provided' }}
              </span>

            </div>


            <!-- DETAILS -->
            <div class="superintendent-complaint-details">

              <div class="superintendent-detail-item">

                <span>
                  Student
                </span>

                <strong>
                  {{ complaint.studentName || 'Not provided' }}
                </strong>

              </div>


              <div class="superintendent-detail-item">

                <span>
                  Room Number
                </span>

                <strong>
                  {{ complaint.roomNumber || 'Not provided' }}
                </strong>

              </div>


              <div class="superintendent-detail-item">

                <span>
                  Block
                </span>

                <strong>
                  {{ complaint.block || 'Not provided' }}
                </strong>

              </div>


              <div class="superintendent-detail-item">

                <span>
                  Warden
                </span>

                <strong>
                  {{ complaint.warden || 'Not provided' }}
                </strong>

              </div>


              <div class="superintendent-detail-item">

                <span>
                  Complaint Type
                </span>

                <strong>
                  {{ complaint.complaintType || 'Not provided' }}
                </strong>

              </div>


              <div class="superintendent-detail-item">

                <span>
                  Superintendent
                </span>

                <strong>
                  {{ complaint.superintendent || 'Not sent' }}
                </strong>

              </div>


              <!-- STATUS -->
              <div class="superintendent-detail-item">

                <span>
                  Current Status
                </span>

                <select
                  class="superintendent-status-select"
                  [(ngModel)]="complaint.status"
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


            <!-- DESCRIPTION -->
            <div class="superintendent-description">

              <div class="superintendent-description-title">
                Complaint Description
              </div>

              <p>
                {{ complaint.description || 'Not provided' }}
              </p>

            </div>


            <!-- PHOTO -->
            <div
              class="superintendent-photo-section"
              *ngIf="complaint.photoPath"
            >

              <span>
                Supporting Photograph
              </span>

              <a
                [href]="getPhotoUrl(complaint.photoPath)"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Photo
              </a>

            </div>


            <!-- NO PHOTO -->
            <div
              class="superintendent-no-photo"
              *ngIf="!complaint.photoPath"
            >
              No supporting photograph uploaded
            </div>

          </div>


          <!-- EMPTY STATE -->
          <div
            class="superintendent-empty-state"
            *ngIf="complaints.length === 0"
          >

            <h3>
              No Escalated Complaints
            </h3>

            <p>
              There are currently no complaints sent to the Superintendent.
            </p>

          </div>

        </section>

      </main>


      <!-- FOOTER -->
      <footer class="superintendent-footer">

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
export class SuperintendentDashboardComponent implements OnInit {

  complaints: any[] = [];

  superintendentName = 'Basanta Manjari Dash';


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.loadComplaints();

  }


  loadComplaints(): void {

    this.http.get<any[]>(
      'http://localhost:8080/complaints'
    ).subscribe({

      next: (data) => {

        const loggedInSuperintendent =
          this.superintendentName
            .trim()
            .replace(/\s+/g, ' ')
            .toLowerCase();


        this.complaints = data.filter(
          (complaint) => {

            const complaintSuperintendent =
              (complaint.superintendent || '')
                .toString()
                .trim()
                .replace(/\s+/g, ' ')
                .toLowerCase();


            return (
              complaintSuperintendent ===
              loggedInSuperintendent
            );

          }
        );


        console.log(
          'All complaints from backend:',
          data
        );

        console.log(
          'Superintendent complaints:',
          this.complaints
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


  getPendingCount(): number {

    return this.complaints.filter(
      (complaint) =>
        (complaint.status || 'Pending') ===
        'Pending'
    ).length;

  }


  getInProgressCount(): number {

    return this.complaints.filter(
      (complaint) =>
        complaint.status === 'In Progress'
    ).length;

  }


  getResolvedCount(): number {

    return this.complaints.filter(
      (complaint) =>
        complaint.status === 'Resolved'
    ).length;

  }


  getStatusClass(status: string): string {

    switch (status) {

      case 'In Progress':
        return 'status-progress';

      case 'Resolved':
        return 'status-resolved';

      case 'Pending':
      default:
        return 'status-pending';

    }

  }


  getPhotoUrl(photoPath: string): string {

    const filename =
      photoPath
        .split('/')
        .pop() || '';

    return (
      'http://localhost:8080/complaints/photo/' +
      filename
    );

  }


  logout(): void {

    localStorage.removeItem('loggedInRole');
    localStorage.removeItem('studentName');
    localStorage.removeItem('loggedInWarden');

    this.router.navigate([
      '/login'
    ]);

  }

}
