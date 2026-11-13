import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
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
            <h1>Warden Portal</h1>
            <p>Hostel Administration</p>
          </div>
        </div>

        <div class="warden-header-right">
          <div class="warden-profile">
            <span class="warden-profile-label">Logged in as</span>
            <strong>{{ loggedInWarden }}</strong>
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
          <h2>Warden Dashboard</h2>
          <p>View and manage complaints assigned to {{ loggedInWarden }}.</p>
        </section>

        <!-- =========================
             HOSTELLER MANAGEMENT (BULK CSV + MANUAL)
             ========================= -->
        <section class="warden-info-card" style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 class="warden-info-title" style="margin: 0;">
              👥 Hosteller Management (Add Verified Residents)
            </h3>
            <button
              type="button"
              (click)="toggleStudentForm()"
              style="background: #003366; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;"
            >
              {{ showStudentForm ? 'Hide' : 'Manage Hostellers' }}
            </button>
          </div>

          <!-- Section appears when opened -->
          <div *ngIf="showStudentForm" style="padding-top: 16px; border-top: 1px solid #e2e8f0;">

            <!-- 1. BULK IMPORT VIA EXCEL / CSV (FASTEST OPTION) -->
            <div style="background: #f0f9ff; border: 1px dashed #0284c7; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 6px 0; color: #0369a1; font-size: 14px;">
                📁 Option A: Bulk Import from Excel / CSV Sheet (Recommended - 1 Click)
              </h4>
              <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
                Save your hostel Excel sheet as <strong>CSV</strong> (Columns: <code>name, collegeRegistrationId, email</code>) and upload it here:
              </p>

              <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <input
                  type="file"
                  accept=".csv"
                  (change)="onCsvFileSelected($event)"
                  style="font-size: 13px;"
                >
                <button
                  type="button"
                  (click)="uploadCsv()"
                  style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 13px;"
                >
                  Upload & Import All Students
                </button>

                <span *ngIf="csvUploadMessage" style="color: #16a34a; font-weight: 600; font-size: 13px;">
                  ✅ {{ csvUploadMessage }}
                </span>
                <span *ngIf="csvErrorMessage" style="color: #dc2626; font-weight: 600; font-size: 13px;">
                  ❌ {{ csvErrorMessage }}
                </span>
              </div>
            </div>

            <!-- 2. MANUAL SINGLE STUDENT ENTRY (IF NEEDED) -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 12px;">
              <h4 style="margin: 0 0 12px 0; color: #334155; font-size: 13px;">
                ➕ Option B: Add Single Hosteller Manually
              </h4>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px;">
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #334155;">Student Name *</label>
                  <input
                    type="text"
                    [(ngModel)]="newStudentName"
                    placeholder="e.g. Sneha Sharma"
                    style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; box-sizing: border-box;"
                  >
                </div>

                <div>
                  <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #334155;">Registration ID *</label>
                  <input
                    type="text"
                    [(ngModel)]="newStudentRegId"
                    placeholder="e.g. 210101120015"
                    style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; box-sizing: border-box;"
                  >
                </div>

                <div>
                  <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #334155;">Email *</label>
                  <input
                    type="email"
                    [(ngModel)]="newStudentEmail"
                    placeholder="e.g. sneha@gmail.com"
                    style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; box-sizing: border-box;"
                  >
                </div>

                <div>
                  <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #334155;">Password (Optional)</label>
                  <input
                    type="text"
                    [(ngModel)]="newStudentPassword"
                    placeholder="Default: 1234"
                    style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; box-sizing: border-box;"
                  >
                </div>
              </div>

              <div style="display: flex; gap: 12px; align-items: center;">
                <button
                  type="button"
                  (click)="registerStudent()"
                  style="background: #16a34a; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px;"
                >
                  Save Student
                </button>

                <span *ngIf="studentSuccessMessage" style="color: #16a34a; font-weight: 600; font-size: 12px;">
                  ✅ {{ studentSuccessMessage }}
                </span>

                <span *ngIf="studentErrorMessage" style="color: #dc2626; font-weight: 600; font-size: 12px;">
                  ❌ {{ studentErrorMessage }}
                </span>
              </div>
            </div>

          </div>
        </section>

        <!-- =========================
             WARDEN INFORMATION
             ========================= -->
        <section class="warden-info-card">
          <h3 class="warden-info-title">Warden Information</h3>
          <div class="warden-info-grid">
            <div class="warden-info-item">
              <span>Warden Name</span>
              <strong>{{ loggedInWarden }}</strong>
            </div>
          </div>
        </section>

        <!-- =========================
             SUMMARY
             ========================= -->
        <section class="warden-summary-grid">
          <div class="warden-summary-card">
            <span>Total Assigned</span>
            <strong>{{ filteredComplaints.length }}</strong>
          </div>

          <div class="warden-summary-card">
            <span>Pending</span>
            <strong>{{ getPendingCount() }}</strong>
          </div>

          <div class="warden-summary-card">
            <span>In Progress</span>
            <strong>{{ getInProgressCount() }}</strong>
          </div>

          <div class="warden-summary-card">
            <span>Resolved</span>
            <strong>{{ getResolvedCount() }}</strong>
          </div>
        </section>

        <!-- =========================
             ASSIGNED COMPLAINTS
             ========================= -->
        <section class="warden-complaints-section">
          <div class="warden-section-heading">
            <div>
              <h3>Assigned Complaints</h3>
              <p>Complaints assigned to {{ loggedInWarden }}</p>
            </div>
            <span class="warden-complaint-count">{{ filteredComplaints.length }}</span>
          </div>

          <!-- COMPLAINT CARDS -->
          <div
            class="warden-complaint-card"
            *ngFor="let complaint of filteredComplaints"
          >
            <!-- Complaint Header -->
            <div class="warden-complaint-header">
              <div class="complaint-title-group">
                <h4>Complaint #{{ complaint.id }}</h4>
                <span class="warden-complaint-type">
                  {{ complaint.complaintType || 'General' }}
                </span>
              </div>
            </div>

            <!-- Complaint Details -->
            <div class="warden-complaint-details">
              <div class="warden-detail-item">
                <span>Student</span>
                <strong>{{ complaint.studentName || 'Not provided' }}</strong>
              </div>

              <div class="warden-detail-item">
                <span>Room Number</span>
                <strong>{{ complaint.roomNumber || 'Not provided' }}</strong>
              </div>

              <div class="warden-detail-item">
                <span>Block</span>
                <strong>{{ complaint.block || 'Not provided' }}</strong>
              </div>

              <div class="warden-detail-item">
                <span>Current Status</span>
                <strong
                  class="status-badge"
                  [ngClass]="getStatusClass(complaint.status)"
                >
                  {{ complaint.status || 'Pending' }}
                </strong>
              </div>
            </div>

            <!-- Description -->
            <div class="warden-description">
              <span class="warden-description-title">Complaint Description</span>
              <p>{{ complaint.description || 'No description provided.' }}</p>
            </div>

            <!-- Status Update -->
            <div class="warden-status-section">
              <span class="warden-status-label">Update Complaint Status</span>
              <select
                class="warden-status-select"
                [value]="complaint.status || 'Pending'"
                (change)="updateStatus(complaint, $event)"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <!-- Photograph -->
            <div
              class="warden-photo-section"
              *ngIf="complaint.photoPath"
            >
              <span>Supporting Photograph</span>
              <a
                [href]="'http://localhost:8080/complaints/photo/' + complaint.photoPath"
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

          <!-- Empty State -->
          <div
            class="warden-empty-state"
            *ngIf="filteredComplaints.length === 0"
          >
            <h3>No Complaints Assigned</h3>
            <p>There are currently no complaints assigned to {{ loggedInWarden }}.</p>
          </div>
        </section>

      </main>

      <!-- =========================
           FOOTER
           ========================= -->
      <footer class="warden-footer">
        <p>Centurion University of Technology and Management</p>
        <span>Hostel Administration</span>
      </footer>

    </div>
  `
})
export class WardenDashboardComponent implements OnInit {

  complaints: any[] = [];
  filteredComplaints: any[] = [];
  loggedInWarden = '';

  // Form State
  showStudentForm = false;

  // Single Student
  newStudentName = '';
  newStudentRegId = '';
  newStudentEmail = '';
  newStudentPassword = '';
  studentSuccessMessage = '';
  studentErrorMessage = '';

  // Bulk CSV Upload
  selectedCsvFile: File | null = null;
  csvUploadMessage = '';
  csvErrorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loggedInWarden =
      localStorage.getItem('loggedInWarden') || 'Pramila Dash';

    this.loadComplaints();
  }

  toggleStudentForm() {
    this.showStudentForm = !this.showStudentForm;
    this.studentSuccessMessage = '';
    this.studentErrorMessage = '';
    this.csvUploadMessage = '';
    this.csvErrorMessage = '';
  }

  // File selected by warden
  onCsvFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCsvFile = input.files[0];
    }
  }

  // Upload CSV to backend
  uploadCsv() {
    this.csvUploadMessage = '';
    this.csvErrorMessage = '';

    if (!this.selectedCsvFile) {
      this.csvErrorMessage = 'Please choose a .csv file first.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedCsvFile);

    this.http.post<any>('http://localhost:8080/users/upload-csv', formData).subscribe({
      next: (res) => {
        this.csvUploadMessage = res.message || 'Import successful!';
        this.selectedCsvFile = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('CSV upload error:', err);
        if (err.error && err.error.message) {
          this.csvErrorMessage = err.error.message;
        } else {
          this.csvErrorMessage = 'Failed to upload CSV file.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  // Single Student Add
  registerStudent() {
    this.studentSuccessMessage = '';
    this.studentErrorMessage = '';

    if (!this.newStudentName.trim() || !this.newStudentRegId.trim() || !this.newStudentEmail.trim()) {
      this.studentErrorMessage = 'Please fill in Name, Registration ID, and Email.';
      return;
    }

    const payload = {
      name: this.newStudentName.trim(),
      collegeRegistrationId: this.newStudentRegId.trim(),
      email: this.newStudentEmail.trim().toLowerCase(),
      password: this.newStudentPassword.trim() || '1234'
    };

    this.http.post<any>('http://localhost:8080/users/student', payload).subscribe({
      next: (res) => {
        this.studentSuccessMessage = `${payload.name} (${payload.collegeRegistrationId}) registered! Default password: ${payload.password}`;
        this.newStudentName = '';
        this.newStudentRegId = '';
        this.newStudentEmail = '';
        this.newStudentPassword = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error adding student:', err);
        if (err.error && err.error.message) {
          this.studentErrorMessage = err.error.message;
        } else {
          this.studentErrorMessage = 'Failed to register student. Make sure backend is running.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadComplaints() {
    this.http
      .get<any[]>('http://localhost:8080/complaints')
      .subscribe({
        next: (data) => {
          this.complaints = data;
          this.filterComplaints();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading complaints:', error);
        }
      });
  }

  filterComplaints() {
    if (!this.loggedInWarden) {
      this.filteredComplaints = [];
      return;
    }

    const loggedWarden = this.loggedInWarden.trim().toLowerCase();

    this.filteredComplaints = this.complaints.filter((complaint) => {
      const complaintWarden = (complaint.warden || '').trim().toLowerCase();
      return complaintWarden === loggedWarden;
    });
  }

  getPendingCount(): number {
    return this.filteredComplaints.filter(
      (complaint) => (complaint.status || 'Pending').trim().toLowerCase() === 'pending'
    ).length;
  }

  getInProgressCount(): number {
    return this.filteredComplaints.filter(
      (complaint) => (complaint.status || '').trim().toLowerCase() === 'in progress'
    ).length;
  }

  getResolvedCount(): number {
    return this.filteredComplaints.filter(
      (complaint) => (complaint.status || '').trim().toLowerCase() === 'resolved'
    ).length;
  }

  getStatusClass(status: string): string {
    const currentStatus = (status || 'Pending').trim().toLowerCase();
    if (currentStatus === 'resolved') {
      return 'status-resolved';
    }
    if (currentStatus === 'in progress') {
      return 'status-progress';
    }
    return 'status-pending';
  }

  updateStatus(complaint: any, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    this.http
      .put<any>(
        `http://localhost:8080/complaints/${complaint.id}/status?status=${encodeURIComponent(newStatus)}`,
        {}
      )
      .subscribe({
        next: (updatedComplaint) => {
          complaint.status = updatedComplaint.status;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error updating complaint status:', error);
          alert('Failed to update complaint status.');
          select.value = complaint.status || 'Pending';
        }
      });
  }

  logout() {
    localStorage.removeItem('loggedInRole');
    localStorage.removeItem('loggedInWarden');
    this.router.navigate(['/login']);
  }
}
