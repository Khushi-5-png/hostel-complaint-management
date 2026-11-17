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
           MAIN NAVIGATION TABS
           ========================= -->
      <nav class="admin-tabs">
        <button
          type="button"
          class="tab-button"
          [class.active]="activeTab === 'all'"
          (click)="setActiveTab('all')"
        >
          📋 All Complaints ({{ allComplaints.length }})
        </button>

        <button
          type="button"
          class="tab-button"
          [class.active]="activeTab === 'warden'"
          (click)="setActiveTab('warden')"
        >
          🏢 Warden View
        </button>

        <button
          type="button"
          class="tab-button"
          [class.active]="activeTab === 'superintendent'"
          (click)="setActiveTab('superintendent')"
        >
          ⭐ Superintendent Escalations
        </button>

        <button
          type="button"
          class="tab-button"
          [class.active]="activeTab === 'csv'"
          (click)="setActiveTab('csv')"
        >
          📥 Import Hostellers (CSV)
        </button>
      </nav>

      <!-- =========================
           MAIN CONTENT
           ========================= -->
      <main class="warden-main">

        <!-- KPI SUMMARY CARDS -->
        <section class="warden-kpi-grid">
          <div class="kpi-card">
            <h3>Total System Complaints</h3>
            <p class="kpi-number">{{ allComplaints.length }}</p>
          </div>

          <div class="kpi-card kpi-pending">
            <h3>Pending</h3>
            <p class="kpi-number">{{ getPendingCount() }}</p>
          </div>

          <div class="kpi-card kpi-progress">
            <h3>In Progress</h3>
            <p class="kpi-number">{{ getInProgressCount() }}</p>
          </div>

          <div class="kpi-card kpi-resolved">
            <h3>Resolved</h3>
            <p class="kpi-number">{{ getResolvedCount() }}</p>
          </div>
        </section>

        <!-- ==============================================
             TAB 1: ALL COMPLAINTS (WITH SEARCH, FILTERS & DATE)
             ============================================== -->
        <section *ngIf="activeTab === 'all'" class="tab-content-section">
          <div class="table-header-row">
            <h2>All Complaints (System-Wide)</h2>
            <span class="count-badge">
              Showing {{ getFilteredAllComplaints().length }} of {{ allComplaints.length }} complaints
            </span>
          </div>

          <!-- SEARCH & FILTER TOOLBAR -->
          <div style="background: white; padding: 14px 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">

            <!-- SEARCH BOX -->
            <div style="flex: 1; min-width: 220px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🔍</span>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Search by student name, room (e.g. 102), ID..."
                style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"
              >
            </div>

            <!-- CATEGORY FILTER -->
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b;">Category:</span>
              <select
                [(ngModel)]="selectedCategory"
                style="padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; background: white;"
              >
                <option value="">All Categories</option>
                <option value="WiFi">WiFi</option>
                <option value="Electricity">Electricity</option>
                <option value="Plumbing">Water / Plumbing</option>
                <option value="Food">Food / Mess</option>
                <option value="Cleaning">Room Cleaning</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>

            <!-- STATUS FILTER -->
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b;">Status:</span>
              <select
                [(ngModel)]="selectedStatus"
                style="padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; background: white;"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <!-- RESET BUTTON -->
            <button
              type="button"
              (click)="resetFilters()"
              style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer;"
            >
              Reset
            </button>
          </div>

          <!-- COMPLAINTS TABLE (NEWEST FIRST) -->
          <div class="warden-table-container">
            <table class="warden-table">
              <thead>
              <tr>
                <th># ID</th>
                <th>Date</th>
                <th>Student Name</th>
                <th>Room</th>
                <th>Category</th>
                <th>Description</th>
                <th>Assigned Warden</th>
                <th>Photo</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let complaint of getFilteredAllComplaints()">
                <td><strong>#{{ complaint.id }}</strong></td>
                <td>
                    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1px solid #e2e8f0;">
                      {{ formatDate(complaint.createdAt) }}
                    </span>
                </td>
                <td>{{ complaint.studentName }}</td>
                <td><span class="room-badge">{{ complaint.roomNumber }}</span></td>
                <td>{{ complaint.complaintType }}</td>
                <td style="max-width: 200px; white-space: normal;">{{ complaint.description }}</td>
                <td>{{ complaint.warden }}</td>
                <td>
                  <a
                    *ngIf="complaint.photoPath"
                    [href]="'http://localhost:8080/complaints/photo/' + complaint.photoPath"
                    target="_blank"
                    class="photo-link"
                  >
                    📷 View
                  </a>
                  <span *ngIf="!complaint.photoPath" style="color: #94a3b8; font-size: 12px;">None</span>
                </td>
                <td>
                  <select
                    [value]="complaint.status || 'Pending'"
                    (change)="updateStatus(complaint, $event)"
                    class="status-select"
                    [ngClass]="getStatusClass(complaint.status)"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
              </tbody>
            </table>

            <div *ngIf="getFilteredAllComplaints().length === 0" style="padding: 30px; text-align: center; color: #64748b;">
              No complaints match your search filter.
            </div>
          </div>
        </section>

        <!-- ==============================================
             TAB 2: WARDEN SPECIFIC VIEW
             ============================================== -->
        <section *ngIf="activeTab === 'warden'" class="tab-content-section">
          <div class="table-header-row">
            <h2>Warden Assigned Complaints</h2>
            <div class="warden-filter">
              <label for="wardenSelect">Warden:</label>
              <select
                id="wardenSelect"
                [(ngModel)]="selectedWarden"
                (change)="filterComplaints()"
              >
                <option value="Pramila Dash">Pramila Dash (Block A)</option>
                <option value="Binod Manjari">Binod Manjari (Block B)</option>
              </select>
            </div>
          </div>

          <div class="warden-table-container">
            <table class="warden-table">
              <thead>
              <tr>
                <th># ID</th>
                <th>Date</th>
                <th>Student Name</th>
                <th>Room</th>
                <th>Category</th>
                <th>Description</th>
                <th>Photo</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let complaint of wardenComplaints">
                <td><strong>#{{ complaint.id }}</strong></td>
                <td>
                    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1px solid #e2e8f0;">
                      {{ formatDate(complaint.createdAt) }}
                    </span>
                </td>
                <td>{{ complaint.studentName }}</td>
                <td><span class="room-badge">{{ complaint.roomNumber }}</span></td>
                <td>{{ complaint.complaintType }}</td>
                <td style="max-width: 220px; white-space: normal;">{{ complaint.description }}</td>
                <td>
                  <a
                    *ngIf="complaint.photoPath"
                    [href]="'http://localhost:8080/complaints/photo/' + complaint.photoPath"
                    target="_blank"
                    class="photo-link"
                  >
                    📷 View
                  </a>
                  <span *ngIf="!complaint.photoPath" style="color: #94a3b8; font-size: 12px;">None</span>
                </td>
                <td>
                  <select
                    [value]="complaint.status || 'Pending'"
                    (change)="updateStatus(complaint, $event)"
                    class="status-select"
                    [ngClass]="getStatusClass(complaint.status)"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ==============================================
             TAB 3: SUPERINTENDENT ESCALATIONS
             ============================================== -->
        <section *ngIf="activeTab === 'superintendent'" class="tab-content-section">
          <div class="table-header-row">
            <h2>Superintendent Escalations (Basanta Manjari Dash)</h2>
            <span class="count-badge">{{ superintendentComplaints.length }} Escalated Issues</span>
          </div>

          <div class="warden-table-container">
            <table class="warden-table">
              <thead>
              <tr>
                <th># ID</th>
                <th>Date</th>
                <th>Student Name</th>
                <th>Room</th>
                <th>Category</th>
                <th>Description</th>
                <th>Assigned Warden</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let complaint of superintendentComplaints">
                <td><strong>#{{ complaint.id }}</strong></td>
                <td>
                    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1px solid #e2e8f0;">
                      {{ formatDate(complaint.createdAt) }}
                    </span>
                </td>
                <td>{{ complaint.studentName }}</td>
                <td><span class="room-badge">{{ complaint.roomNumber }}</span></td>
                <td>{{ complaint.complaintType }}</td>
                <td style="max-width: 220px; white-space: normal;">{{ complaint.description }}</td>
                <td>{{ complaint.warden }}</td>
                <td>
                  <select
                    [value]="complaint.status || 'Pending'"
                    (change)="updateStatus(complaint, $event)"
                    class="status-select"
                    [ngClass]="getStatusClass(complaint.status)"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ==============================================
             TAB 4: HOSTELLER MANAGEMENT (CSV BULK IMPORT)
             ============================================== -->
        <section *ngIf="activeTab === 'csv'" class="tab-content-section">
          <div class="csv-card">
            <h2>Bulk Import Verified Hostel Residents (Excel / CSV)</h2>
            <p>
              Upload an official resident list (.csv) with columns:
              <code>name, collegeRegistrationId, email</code>.
              Default password for each student will automatically be <code>1234</code>.
            </p>

            <div class="csv-upload-box">
              <input
                type="file"
                accept=".csv"
                (change)="onCsvFileSelected($event)"
              >
              <button
                type="button"
                class="csv-upload-btn"
                (click)="uploadCsv()"
              >
                Upload & Register Students
              </button>
            </div>

            <p *ngIf="csvUploadMessage" class="success-message">{{ csvUploadMessage }}</p>
            <p *ngIf="csvErrorMessage" class="error-message">{{ csvErrorMessage }}</p>
          </div>
        </section>

      </main>

      <!-- FOOTER -->
      <footer class="student-footer">
        <p>Centurion University of Technology and Management</p>
        <span>Hostel Complaint Management Portal</span>
      </footer>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {

  currentUserRole = 'Administrator';
  activeTab = 'all';

  allComplaints: any[] = [];
  wardenComplaints: any[] = [];
  superintendentComplaints: any[] = [];

  selectedWarden = 'Pramila Dash';

  // Search & Filter state
  searchQuery = '';
  selectedCategory = '';
  selectedStatus = '';

  // CSV
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
    }

    const savedWarden = localStorage.getItem('loggedInWarden');
    if (savedWarden) {
      this.selectedWarden = savedWarden;
    }

    this.loadComplaints();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  loadComplaints() {
    this.http.get<any[]>('http://localhost:8080/complaints').subscribe({
      next: (data) => {
        // Sort newest first by ID!
        this.allComplaints = data.sort((a, b) => (b.id || 0) - (a.id || 0));
        this.filterComplaints();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading complaints:', err);
      }
    });
  }

  filterComplaints() {
    const wardenTarget = (this.selectedWarden || '').trim().toLowerCase();

    // Warden view (newest first)
    this.wardenComplaints = this.allComplaints.filter((c) => {
      const assigned = (c.warden || '').trim().toLowerCase();
      return assigned.includes(wardenTarget) || wardenTarget.includes(assigned);
    });

    // Superintendent view (newest first)
    this.superintendentComplaints = this.allComplaints.filter((c) => {
      return c.superintendent && c.superintendent.trim().length > 0;
    });
  }

  getFilteredAllComplaints(): any[] {
    const query = this.searchQuery.trim().toLowerCase();
    const category = this.selectedCategory.trim().toLowerCase();
    const status = this.selectedStatus.trim().toLowerCase();

    return this.allComplaints.filter((c) => {
      // 1. Text Search matching
      const matchesQuery = !query ||
        String(c.id).includes(query) ||
        (c.studentName && c.studentName.toLowerCase().includes(query)) ||
        (c.roomNumber && c.roomNumber.toLowerCase().includes(query)) ||
        (c.description && c.description.toLowerCase().includes(query));

      // 2. Category Filter
      const matchesCategory = !category ||
        (c.complaintType && c.complaintType.toLowerCase().includes(category));

      // 3. Status Filter
      const matchesStatus = !status ||
        ((c.status || 'Pending').toLowerCase() === status);

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
  }

  formatDate(dateStr: any): string {
    if (!dateStr) {
      return 'Recent';
    }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        return 'Recent';
      }
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  }

  getPendingCount(): number {
    return this.allComplaints.filter(
      (c) => (c.status || 'Pending').trim().toLowerCase() === 'pending'
    ).length;
  }

  getInProgressCount(): number {
    return this.allComplaints.filter(
      (c) => (c.status || '').trim().toLowerCase() === 'in progress'
    ).length;
  }

  getResolvedCount(): number {
    return this.allComplaints.filter(
      (c) => (c.status || '').trim().toLowerCase() === 'resolved'
    ).length;
  }

  getStatusClass(status: string): string {
    const current = (status || 'Pending').trim().toLowerCase();
    if (current === 'resolved') {
      return 'status-resolved';
    }
    if (current === 'in progress') {
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
