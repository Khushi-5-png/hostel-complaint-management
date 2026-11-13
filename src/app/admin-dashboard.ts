import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
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
           TOP HEADER
           ========================= -->
      <header class="warden-header">
        <div class="warden-header-left">
          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
            class="warden-logo"
          >
          <div>
            <h1>Hostel Administration Portal</h1>
            <p>Unified Dashboard for Admin, Warden & Superintendent</p>
          </div>
        </div>

        <div class="warden-header-right">
          <div class="warden-profile">
            <span class="warden-profile-label">Logged in as</span>
            <strong>{{ currentUserRole.toUpperCase() }}</strong>
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
           MAIN CONTAINER
           ========================= -->
      <main class="warden-main">

        <!-- UNIFIED NAVIGATION TABS -->
        <nav style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; flex-wrap: wrap;">
          <button
            type="button"
            (click)="activeTab = 'all'"
            [style.background]="activeTab === 'all' ? '#003366' : '#f1f5f9'"
            [style.color]="activeTab === 'all' ? 'white' : '#334155'"
            style="border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px;"
          >
            📊 All Complaints (Overview)
          </button>

          <button
            type="button"
            (click)="activeTab = 'warden'"
            [style.background]="activeTab === 'warden' ? '#003366' : '#f1f5f9'"
            [style.color]="activeTab === 'warden' ? 'white' : '#334155'"
            style="border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px;"
          >
            👩‍🏫 Warden View
          </button>

          <button
            type="button"
            (click)="activeTab = 'superintendent'"
            [style.background]="activeTab === 'superintendent' ? '#003366' : '#f1f5f9'"
            [style.color]="activeTab === 'superintendent' ? 'white' : '#334155'"
            style="border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px;"
          >
            🏛️ Superintendent (Escalated)
          </button>

          <button
            type="button"
            (click)="activeTab = 'hostellers'"
            [style.background]="activeTab === 'hostellers' ? '#003366' : '#f1f5f9'"
            [style.color]="activeTab === 'hostellers' ? 'white' : '#334155'"
            style="border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px;"
          >
            👥 Manage Hostellers (CSV)
          </button>
        </nav>

        <!-- =========================
             GLOBAL SUMMARY STATS
             ========================= -->
        <section class="warden-summary-grid" style="margin-bottom: 24px;">
          <div class="warden-summary-card">
            <span>Total System Complaints</span>
            <strong>{{ complaints.length }}</strong>
          </div>
          <div class="warden-summary-card">
            <span>Pending</span>
            <strong>{{ getPendingCount(complaints) }}</strong>
          </div>
          <div class="warden-summary-card">
            <span>In Progress</span>
            <strong>{{ getInProgressCount(complaints) }}</strong>
          </div>
          <div class="warden-summary-card">
            <span>Resolved</span>
            <strong>{{ getResolvedCount(complaints) }}</strong>
          </div>
        </section>

        <!-- =========================================================
             TAB 1: ALL COMPLAINTS (OVERVIEW / ADMIN)
             ========================================================= -->
        <div *ngIf="activeTab === 'all'">
          <section class="warden-complaints-section">
            <div class="warden-section-heading">
              <div>
                <h3>All Complaints (Campus-Wide)</h3>
                <p>Viewing all registered hostel issues across all blocks</p>
              </div>
              <span class="warden-complaint-count">{{ complaints.length }}</span>
            </div>

            <!-- Complaint Cards -->
            <div class="warden-complaint-card" *ngFor="let complaint of complaints">
              <div class="warden-complaint-header">
                <div class="complaint-title-group">
                  <h4>Complaint #{{ complaint.id }}</h4>
                  <span class="warden-complaint-type">{{ complaint.complaintType || 'General' }}</span>
                </div>
              </div>

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
                  <span>Assigned Warden</span>
                  <strong>{{ complaint.warden || 'Not assigned' }}</strong>
                </div>
                <div class="warden-detail-item">
                  <span>Superintendent</span>
                  <strong>{{ complaint.superintendent || 'Not escalated' }}</strong>
                </div>
                <div class="warden-detail-item">
                  <span>Current Status</span>
                  <strong class="status-badge" [ngClass]="getStatusClass(complaint.status)">
                    {{ complaint.status || 'Pending' }}
                  </strong>
                </div>
              </div>

              <div class="warden-description">
                <span class="warden-description-title">Complaint Description</span>
                <p>{{ complaint.description || 'No description provided.' }}</p>
              </div>

              <div class="warden-status-section">
                <span class="warden-status-label">Update Status</span>
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

              <div class="warden-photo-section" *ngIf="complaint.photoPath">
                <span>Photograph:</span>
                <a [href]="'http://localhost:8080/complaints/photo/' + complaint.photoPath" target="_blank">
                  View Attached Photo
                </a>
              </div>
            </div>
          </section>
        </div>

        <!-- =========================================================
             TAB 2: WARDEN VIEW
             ========================================================= -->
        <div *ngIf="activeTab === 'warden'">
          <section class="warden-info-card" style="margin-bottom: 20px;">
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
              <label style="font-weight: 600; color: #334155;">Filter by Warden:</label>
              <select
                [(ngModel)]="selectedWarden"
                style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-weight: 600;"
              >
                <option *ngFor="let w of wardensList" [value]="w">{{ w }}</option>
              </select>
              <span style="font-size: 13px; color: #64748b;">
                Showing complaints assigned to <strong>{{ selectedWarden }}</strong>
              </span>
            </div>
          </section>

          <section class="warden-complaints-section">
            <div class="warden-section-heading">
              <div>
                <h3>Assigned to {{ selectedWarden }}</h3>
                <p>Warden resolution queue</p>
              </div>
              <span class="warden-complaint-count">{{ getWardenComplaints().length }}</span>
            </div>

            <div class="warden-complaint-card" *ngFor="let complaint of getWardenComplaints()">
              <div class="warden-complaint-header">
                <div class="complaint-title-group">
                  <h4>Complaint #{{ complaint.id }}</h4>
                  <span class="warden-complaint-type">{{ complaint.complaintType || 'General' }}</span>
                </div>
              </div>

              <div class="warden-complaint-details">
                <div class="warden-detail-item">
                  <span>Student</span>
                  <strong>{{ complaint.studentName || 'Not provided' }}</strong>
                </div>
                <div class="warden-detail-item">
                  <span>Room</span>
                  <strong>{{ complaint.roomNumber || 'Not provided' }} ({{ complaint.block }})</strong>
                </div>
                <div class="warden-detail-item">
                  <span>Status</span>
                  <strong class="status-badge" [ngClass]="getStatusClass(complaint.status)">
                    {{ complaint.status || 'Pending' }}
                  </strong>
                </div>
              </div>

              <div class="warden-description">
                <p>{{ complaint.description }}</p>
              </div>

              <div class="warden-status-section">
                <span class="warden-status-label">Update Status</span>
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

              <div class="warden-photo-section" *ngIf="complaint.photoPath">
                <a [href]="'http://localhost:8080/complaints/photo/' + complaint.photoPath" target="_blank">
                  View Supporting Photo
                </a>
              </div>
            </div>

            <div class="warden-empty-state" *ngIf="getWardenComplaints().length === 0">
              <h3>No Complaints Assigned</h3>
              <p>No complaints currently assigned to {{ selectedWarden }}.</p>
            </div>
          </section>
        </div>

        <!-- =========================================================
             TAB 3: SUPERINTENDENT (ESCALATED)
             ========================================================= -->
        <div *ngIf="activeTab === 'superintendent'">
          <section class="warden-complaints-section">
            <div class="warden-section-heading">
              <div>
                <h3>Escalated to Superintendent (Basanta Manjari Dash)</h3>
                <p>High-priority complaints flagged by students</p>
              </div>
              <span class="warden-complaint-count">{{ getSuperintendentComplaints().length }}</span>
            </div>

            <div class="warden-complaint-card" *ngFor="let complaint of getSuperintendentComplaints()">
              <div class="warden-complaint-header">
                <div class="complaint-title-group">
                  <h4>Complaint #{{ complaint.id }}</h4>
                  <span class="warden-complaint-type">{{ complaint.complaintType || 'General' }}</span>
                </div>
              </div>

              <div class="warden-complaint-details">
                <div class="warden-detail-item">
                  <span>Student</span>
                  <strong>{{ complaint.studentName }}</strong>
                </div>
                <div class="warden-detail-item">
                  <span>Room & Block</span>
                  <strong>{{ complaint.roomNumber }} - {{ complaint.block }}</strong>
                </div>
                <div class="warden-detail-item">
                  <span>Assigned Warden</span>
                  <strong>{{ complaint.warden }}</strong>
                </div>
                <div class="warden-detail-item">
                  <span>Status</span>
                  <strong class="status-badge" [ngClass]="getStatusClass(complaint.status)">
                    {{ complaint.status || 'Pending' }}
                  </strong>
                </div>
              </div>

              <div class="warden-description">
                <p>{{ complaint.description }}</p>
              </div>

              <div class="warden-status-section">
                <span class="warden-status-label">Update Status</span>
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

              <div class="warden-photo-section" *ngIf="complaint.photoPath">
                <a [href]="'http://localhost:8080/complaints/photo/' + complaint.photoPath" target="_blank">
                  View Supporting Photo
                </a>
              </div>
            </div>

            <div class="warden-empty-state" *ngIf="getSuperintendentComplaints().length === 0">
              <h3>No Escalated Complaints</h3>
              <p>There are no complaints currently escalated to the Superintendent.</p>
            </div>
          </section>
        </div>

        <!-- =========================================================
             TAB 4: MANAGE HOSTELLERS (CSV UPLOAD)
             ========================================================= -->
        <div *ngIf="activeTab === 'hostellers'">
          <section class="warden-info-card">
            <h3 class="warden-info-title">👥 Bulk Import Verified Hostel Residents</h3>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
              Upload your hostel Excel sheet saved as <strong>.csv</strong> (Columns: <code>name, collegeRegistrationId, email</code>) to authorize girls for the portal:
            </p>

            <div style="background: #f0f9ff; border: 1px dashed #0284c7; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
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
                  style="background: #0284c7; color: white; border: none; padding: 10px 18px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 13px;"
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
          </section>
        </div>

      </main>

      <!-- FOOTER -->
      <footer class="warden-footer">
        <p>Centurion University of Technology and Management</p>
        <span>Hostel Administration</span>
      </footer>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {

  complaints: any[] = [];
  activeTab = 'all'; // 'all' | 'warden' | 'superintendent' | 'hostellers'
  currentUserRole = 'Administrator';

  // Warden List
  wardensList = [
    'Pramila Dash',
    'Parbati Mahapatra',
    'Rashmi Rekha Swain',
    'Binod Manjari',
    'Kanaklata Jena'
  ];
  selectedWarden = 'Pramila Dash';

  // CSV State
  selectedCsvFile: File | null = null;
  csvUploadMessage = '';
  csvErrorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const role = localStorage.getItem('loggedInRole');
    if (role) {
      this.currentUserRole = role;
      if (role === 'warden') this.activeTab = 'warden';
      if (role === 'superintendent') this.activeTab = 'superintendent';
    }

    const wardenName = localStorage.getItem('loggedInWarden');
    if (wardenName) {
      this.selectedWarden = wardenName;
    }

    this.loadComplaints();
  }

  loadComplaints() {
    this.http.get<any[]>('http://localhost:8080/complaints').subscribe({
      next: (data) => {
        this.complaints = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading complaints:', err)
    });
  }

  getWardenComplaints() {
    return this.complaints.filter(
      (c) => (c.warden || '').trim().toLowerCase() === this.selectedWarden.trim().toLowerCase()
    );
  }

  getSuperintendentComplaints() {
    return this.complaints.filter(
      (c) => (c.superintendent || '').trim().toLowerCase() === 'basanta manjari dash'
    );
  }

  getPendingCount(list: any[]): number {
    return list.filter((c) => (c.status || 'Pending').trim().toLowerCase() === 'pending').length;
  }

  getInProgressCount(list: any[]): number {
    return list.filter((c) => (c.status || '').trim().toLowerCase() === 'in progress').length;
  }

  getResolvedCount(list: any[]): number {
    return list.filter((c) => (c.status || '').trim().toLowerCase() === 'resolved').length;
  }

  getStatusClass(status: string): string {
    const s = (status || 'Pending').trim().toLowerCase();
    if (s === 'resolved') return 'status-resolved';
    if (s === 'in progress') return 'status-progress';
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
        next: (updated) => {
          complaint.status = updated.status;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating status:', err);
          alert('Failed to update status.');
          select.value = complaint.status || 'Pending';
        }
      });
  }

  onCsvFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCsvFile = input.files[0];
    }
  }

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

  logout() {
    localStorage.removeItem('loggedInRole');
    localStorage.removeItem('loggedInWarden');
    this.router.navigate(['/login']);
  }
}
