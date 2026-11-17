import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
    }

    /* HEADER */
    .portal-header {
      background: linear-gradient(135deg, #002244 0%, #003366 100%);
      color: white;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0, 34, 68, 0.15);
      border-bottom: 3px solid #f59e0b;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-logo {
      height: 48px;
      width: auto;
      background: white;
      padding: 4px;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .header-title h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }

    .header-title p {
      margin: 2px 0 0 0;
      font-size: 13px;
      color: #cbd5e1;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .user-label {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.12);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #ef4444;
      border-color: #ef4444;
    }

    /* MAIN CONTAINER */
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 60px 24px;
    }

    /* HERO BANNER */
    .hero-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      background: white;
      padding: 24px 28px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .hero-text h2 {
      margin: 0;
      font-size: 22px;
      color: #0f172a;
      font-weight: 700;
    }

    .hero-text p {
      margin: 6px 0 0 0;
      font-size: 14px;
      color: #64748b;
    }

    .raise-btn {
      background: linear-gradient(135deg, #003366 0%, #0284c7 100%);
      color: white;
      border: none;
      padding: 12px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .raise-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(2, 132, 199, 0.35);
    }

    /* KPI STAT CARDS */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      padding: 22px 24px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .stat-total::before { background: #003366; }
    .stat-pending::before { background: #f59e0b; }
    .stat-progress::before { background: #3b82f6; }
    .stat-resolved::before { background: #10b981; }

    .stat-label {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
      margin: 10px 0 0 0;
    }

    /* TABLE SECTION */
    .table-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      overflow: hidden;
    }

    .table-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h3 {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
    }

    .count-pill {
      background: #f1f5f9;
      color: #475569;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .table-responsive {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background: #f8fafc;
      padding: 12px 18px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }

    td {
      padding: 16px 18px;
      font-size: 13px;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    tr:hover td {
      background: #f8fafc;
    }

    .id-badge {
      font-weight: 700;
      color: #003366;
    }

    .date-badge {
      background: #f1f5f9;
      color: #475569;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    .room-tag {
      background: #e0f2fe;
      color: #0369a1;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    /* STATUS PILLS */
    .status-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .status-pending {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }

    .status-progress {
      background: #dbeafe;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
    }

    .status-resolved {
      background: #d1fae5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }

    .action-btn {
      background: white;
      border: 1px solid #cbd5e1;
      color: #003366;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .action-btn:hover {
      background: #003366;
      color: white;
      border-color: #003366;
    }

    /* DETAILS DRAWER */
    .detail-card {
      margin-top: 24px;
      background: white;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      padding: 24px;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }

    .detail-header h4 {
      margin: 0;
      font-size: 18px;
      color: #003366;
      font-weight: 700;
    }

    .close-btn {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .detail-item span {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .detail-item strong {
      font-size: 14px;
      color: #0f172a;
    }

    .description-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 14px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.6;
      color: #334155;
    }

    .photo-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #003366;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      margin-top: 12px;
    }

    /* FOOTER */
    footer {
      text-align: center;
      padding: 24px;
      color: #94a3b8;
      font-size: 12px;
    }
  `],
  template: `
    <!-- HEADER -->
    <header class="portal-header">
      <div class="header-left">
        <img
          src="centurion-logo.jpg"
          alt="Centurion University"
          class="header-logo"
        >
        <div class="header-title">
          <h1>Hostel Complaint Management System</h1>
          <p>Student Portal</p>
        </div>
      </div>

      <div class="header-right">
        <div class="user-badge">
          <span class="user-label">Logged in as</span>
          <span class="user-name">{{ studentName }}</span>
        </div>
        <button class="logout-btn" type="button" (click)="logout()">
          Logout
        </button>
      </div>
    </header>

    <!-- DASHBOARD CONTAINER -->
    <div class="dashboard-container">

      <!-- HERO BANNER -->
      <section class="hero-banner">
        <div class="hero-text">
          <h2>Welcome, {{ studentName }} 👋</h2>
          <p>Track your submitted complaints and monitor resolution status in real-time.</p>
        </div>

        <button class="raise-btn" type="button" (click)="raiseComplaint()">
          <span>+</span> Raise New Complaint
        </button>
      </section>

      <!-- KPI STAT CARDS -->
      <section class="stats-grid">
        <div class="stat-card stat-total">
          <p class="stat-label">Total Complaints</p>
          <p class="stat-value">{{ complaints.length }}</p>
        </div>

        <div class="stat-card stat-pending">
          <p class="stat-label">Pending</p>
          <p class="stat-value" style="color: #d97706;">{{ getPendingCount() }}</p>
        </div>

        <div class="stat-card stat-progress">
          <p class="stat-label">In Progress</p>
          <p class="stat-value" style="color: #2563eb;">{{ getInProgressCount() }}</p>
        </div>

        <div class="stat-card stat-resolved">
          <p class="stat-label">Resolved</p>
          <p class="stat-value" style="color: #059669;">{{ getResolvedCount() }}</p>
        </div>
      </section>

      <!-- COMPLAINT LIST TABLE -->
      <section class="table-card">
        <div class="table-header">
          <h3>Your Complaint History</h3>
          <span class="count-pill">Showing {{ complaints.length }} complaints (Newest First)</span>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
            <tr>
              <th># ID</th>
              <th>Date</th>
              <th>Category</th>
              <th>Room</th>
              <th>Assigned Warden</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let complaint of complaints">
              <td><span class="id-badge">#{{ complaint.id }}</span></td>
              <td><span class="date-badge">{{ formatDate(complaint.createdAt) }}</span></td>
              <td><strong>{{ complaint.complaintType }}</strong></td>
              <td><span class="room-tag">Room {{ complaint.roomNumber }}</span></td>
              <td>{{ complaint.warden }}</td>
              <td>
                  <span class="status-pill" [ngClass]="getStatusClass(complaint.status)">
                    {{ complaint.status || 'Pending' }}
                  </span>
              </td>
              <td>
                <button class="action-btn" type="button" (click)="viewComplaint(complaint)">
                  View Details
                </button>
              </td>
            </tr>
            </tbody>
          </table>

          <div *ngIf="complaints.length === 0" style="padding: 48px; text-align: center; color: #64748b;">
            <p style="font-size: 15px; margin-bottom: 12px;">You haven't filed any hostel complaints yet.</p>
            <button class="raise-btn" type="button" (click)="raiseComplaint()">
              + Submit Your First Complaint
            </button>
          </div>
        </div>
      </section>

      <!-- COMPLAINT DETAIL MODAL -->
      <section *ngIf="selectedComplaint" class="detail-card">
        <div class="detail-header">
          <h4>Complaint Details — #{{ selectedComplaint.id }} ({{ selectedComplaint.complaintType }})</h4>
          <button class="close-btn" type="button" (click)="closeComplaint()">✕ Close</button>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span>Date Submitted</span>
            <strong>{{ formatDate(selectedComplaint.createdAt) }}</strong>
          </div>
          <div class="detail-item">
            <span>Room & Block</span>
            <strong>Room {{ selectedComplaint.roomNumber }} ({{ selectedComplaint.block }})</strong>
          </div>
          <div class="detail-item">
            <span>Assigned Warden</span>
            <strong>{{ selectedComplaint.warden }}</strong>
          </div>
          <div class="detail-item">
            <span>Current Status</span>
            <span class="status-pill" [ngClass]="getStatusClass(selectedComplaint.status)">
              {{ selectedComplaint.status || 'Pending' }}
            </span>
          </div>
        </div>

        <div class="detail-item" style="margin-bottom: 16px;">
          <span>Detailed Description</span>
          <div class="description-box">{{ selectedComplaint.description }}</div>
        </div>

        <div *ngIf="selectedComplaint.photoPath">
          <a
            [href]="'http://localhost:8080/complaints/photo/' + selectedComplaint.photoPath"
            target="_blank"
            class="photo-btn"
          >
            📷 View Attached Photograph
          </a>
        </div>
      </section>

    </div>

    <!-- FOOTER -->
    <footer>
      <p>Centurion University of Technology and Management &bull; Hostel Complaint Management System</p>
    </footer>
  `
})
export class StudentDashboardComponent implements OnInit {

  studentName = 'Khushi';
  complaints: any[] = [];
  selectedComplaint: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
      this.studentName = savedName;
    }

    this.loadComplaints();
  }

  loadComplaints() {
    this.http.get<any[]>('http://localhost:8080/complaints').subscribe({
      next: (data) => {
        const loggedInStudent = this.studentName.trim().toLowerCase();

        this.complaints = data
          .filter((complaint) => {
            const complaintStudent = (complaint.studentName || '').trim().toLowerCase();
            return complaintStudent === loggedInStudent;
          })
          .sort((a, b) => (b.id || 0) - (a.id || 0));

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading complaints:', error);
      }
    });
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
    return this.complaints.filter(
      (c) => (c.status || 'Pending').trim().toLowerCase() === 'pending'
    ).length;
  }

  getInProgressCount(): number {
    return this.complaints.filter(
      (c) => (c.status || '').trim().toLowerCase() === 'in progress'
    ).length;
  }

  getResolvedCount(): number {
    return this.complaints.filter(
      (c) => (c.status || '').trim().toLowerCase() === 'resolved'
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

  viewComplaint(complaint: any) {
    this.selectedComplaint = complaint;

    setTimeout(() => {
      const element = document.querySelector('.detail-card');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  closeComplaint() {
    this.selectedComplaint = null;
  }

  raiseComplaint() {
    this.router.navigate(['/complaint']);
  }

  logout() {
    localStorage.removeItem('loggedInRole');
    localStorage.removeItem('studentName');
    this.router.navigate(['/login']);
  }
}
