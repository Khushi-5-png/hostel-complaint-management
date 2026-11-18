import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="admin-portal">

      <!-- ==========================================
           HEADER / NAVBAR
           ========================================== -->
      <header class="admin-header">
        <div class="header-left">
          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
            class="header-logo"
          />
          <div>
            <h1>Hostel Administration & Warden Portal</h1>
            <p>
              <span *ngIf="isWarden()">Resident Warden Console — Block Management</span>
              <span *ngIf="isSuperintendent()">Chief Superintendent — Escalated Grievance Desk</span>
              <span *ngIf="isAdmin()">Central Administrative Oversight (Master Registry)</span>
            </p>
          </div>
        </div>

        <div class="header-right">
          <div class="user-chip">
            <span class="avatar-icon">{{ getAvatar() }}</span>
            <div class="user-meta">
              <span class="user-role-label">{{ getRoleLabel() }}</span>
              <strong>{{ getDisplayName() }}</strong>
            </div>
          </div>
          <button type="button" class="btn-logout" (click)="logout()">
            Logout
          </button>
        </div>
      </header>

      <!-- ==========================================
           MAIN CONTENT
           ========================================== -->
      <main class="admin-main">

        <!-- WELCOME BANNER -->
        <section class="welcome-banner">
          <div>
            <h2>
              <span *ngIf="isWarden()">Assigned Complaints — {{ loggedInWarden }}</span>
              <span *ngIf="isSuperintendent()">Escalated Complaints — Superintendent Desk</span>
              <span *ngIf="isAdmin()">All Campus Complaints (Master Overview)</span>
            </h2>

            <p *ngIf="isWarden()">
              Viewing only complaints assigned to your block. Routine maintenance is managed by you.
            </p>
            <p *ngIf="isSuperintendent()">
              Viewing <strong>only complaints escalated by students</strong> to the Chief Superintendent. Routine minor complaints stay with the block wardens.
            </p>
            <p *ngIf="isAdmin()">
              Central administrative master registry covering all hostel blocks, wardens, and escalations.
            </p>
          </div>

          <div class="banner-badge">
            <span *ngIf="isWarden()" class="badge-warden">🔒 Restricted: Assigned Warden Only</span>
            <span *ngIf="isSuperintendent()" class="badge-super">⚠️ Escalated to Superintendent Only</span>
            <span *ngIf="isAdmin()" class="badge-admin">👑 Full Master Access</span>
          </div>
        </section>

        <!-- 4 KPI SUMMARY CARDS -->
        <section class="kpi-grid">
          <!-- Total -->
          <div class="kpi-card kpi-total">
            <div class="kpi-icon">📁</div>
            <div class="kpi-content">
              <span class="kpi-title">
                <span *ngIf="isWarden()">Assigned to You</span>
                <span *ngIf="isSuperintendent()">Escalated to You</span>
                <span *ngIf="isAdmin()">Total Complaints</span>
              </span>
              <span class="kpi-number">{{ getScopedComplaints().length }}</span>
            </div>
          </div>

          <!-- Pending -->
          <div class="kpi-card kpi-pending">
            <div class="kpi-icon">⏳</div>
            <div class="kpi-content">
              <span class="kpi-title">Pending Action</span>
              <span class="kpi-number text-amber">{{ getPendingCount() }}</span>
            </div>
          </div>

          <!-- In Progress -->
          <div class="kpi-card kpi-progress">
            <div class="kpi-icon">⚙️</div>
            <div class="kpi-content">
              <span class="kpi-title">In Progress</span>
              <span class="kpi-number text-blue">{{ getInProgressCount() }}</span>
            </div>
          </div>

          <!-- Resolved / Closed -->
          <div class="kpi-card kpi-resolved">
            <div class="kpi-icon">✅</div>
            <div class="kpi-content">
              <span class="kpi-title">Resolved / Closed</span>
              <span class="kpi-number text-green">{{ getResolvedCount() }}</span>
            </div>
          </div>
        </section>

        <!-- SEARCH & FILTER TOOLBAR CARD -->
        <section class="filter-card">
          <div class="filter-grid">
            <!-- Search Input -->
            <div class="search-field">
              <span class="search-icon">🔍</span>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="applyFilters()"
                placeholder="Search by student, room (e.g. 203), issue..."
                class="search-input"
              />
            </div>

            <!-- Category Filter -->
            <div class="filter-select-wrapper">
              <label>Category:</label>
              <select [(ngModel)]="selectedCategory" (ngModelChange)="applyFilters()" class="filter-select">
                <option value="all">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="WiFi">WiFi & Internet</option>
                <option value="Electricity">Electricity</option>
                <option value="Food">Food / Mess</option>
                <option value="Room Cleaning">Room Cleaning</option>
                <option value="Door / Lock">Door / Lock</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div class="filter-select-wrapper">
              <label>Status:</label>
              <select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" class="filter-select">
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <!-- Warden Filter (Only visible to Admin) -->
            <div *ngIf="isAdmin()" class="filter-select-wrapper">
              <label>Warden:</label>
              <select [(ngModel)]="selectedWarden" (ngModelChange)="applyFilters()" class="filter-select">
                <option value="all">All Wardens</option>
                <option value="Pramila Dash">Pramila Dash (Block A)</option>
                <option value="Binod Manjari">Binod Manjari (Block B)</option>
                <option value="Parbati Mahapatra">Parbati Mahapatra (Block C)</option>
                <option value="Rashmi Rekha Swain">Rashmi Rekha Swain (Mess)</option>
                <option value="Kanaklata Jena">Kanaklata Jena (Night Duty)</option>
              </select>
            </div>

            <!-- Reset Button -->
            <button type="button" class="btn-reset" (click)="resetFilters()">
              Reset Filters
            </button>
          </div>
        </section>

        <!-- COMPLAINTS TABLE CARD -->
        <section class="table-card">
          <div class="table-header">
            <div>
              <h3>
                <span *ngIf="isWarden()">Complaints Assigned to {{ loggedInWarden }}</span>
                <span *ngIf="isSuperintendent()">Complaints Escalated to Superintendent</span>
                <span *ngIf="isAdmin()">All Campus Complaints</span>
              </h3>
              <p class="table-subtitle">
                Showing {{ filteredComplaints.length }} of {{ getScopedComplaints().length }} complaints matching current filters
              </p>
            </div>
            <span class="badge-count">{{ filteredComplaints.length }} Complaints</span>
          </div>

          <!-- TABLE -->
          <div class="table-responsive">
            <table class="data-table">
              <thead>
              <tr>
                <th># ID</th>
                <th>Date</th>
                <th>Student Name</th>
                <th>Room</th>
                <th>Category</th>
                <th>Description</th>
                <th *ngIf="!isWarden()">Assigned Warden</th>
                <th *ngIf="isAdmin() || isSuperintendent()">Escalated?</th>
                <th>Photo</th>
                <th>Update Status</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let c of filteredComplaints">
                <td>
                  <span class="id-badge">#{{ c.id }}</span>
                </td>
                <td>
                  <span class="date-badge">{{ formatDate(c.createdAt) }}</span>
                </td>
                <td>
                  <strong class="student-name">{{ c.studentName || 'Student' }}</strong>
                </td>
                <td>
                  <span class="room-tag">Room {{ c.roomNumber || '—' }} ({{ c.block || 'Hostel' }})</span>
                </td>
                <td>
                  <span class="category-pill">{{ c.complaintType || 'General' }}</span>
                </td>
                <td class="desc-cell" [title]="c.description">
                  {{ c.description || 'No description provided.' }}
                </td>
                <td *ngIf="!isWarden()">
                  <span class="warden-pill">{{ c.warden || 'Not Assigned' }}</span>
                </td>
                <td *ngIf="isAdmin() || isSuperintendent()">
                  <span *ngIf="isEscalated(c)" class="badge-escalated">⚡ Yes</span>
                  <span *ngIf="!isEscalated(c)" class="badge-routine">Routine</span>
                </td>
                <td>
                  <a
                    *ngIf="c.photoPath"
                    [href]="'http://localhost:8080/uploads/' + c.photoPath"
                    target="_blank"
                    class="photo-link"
                  >
                    📷 View Photo
                  </a>
                  <span *ngIf="!c.photoPath" class="no-photo-label">—</span>
                </td>
                <td>
                  <select
                    [ngModel]="c.status || 'Pending'"
                    (ngModelChange)="updateStatus(c, $event)"
                    [ngClass]="getStatusSelectClass(c.status)"
                    class="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
              </tr>

              <!-- EMPTY STATE -->
              <tr *ngIf="filteredComplaints.length === 0">
                <td [attr.colspan]="isWarden() ? 8 : 10" class="empty-state">
                  <p class="empty-icon">📭</p>
                  <p class="empty-title">No complaints found</p>
                  <p class="empty-sub">
                    <span *ngIf="isSuperintendent()">No students have escalated any complaints to the Superintendent yet.</span>
                    <span *ngIf="isWarden()">No complaints currently assigned to {{ loggedInWarden }}.</span>
                    <span *ngIf="isAdmin()">No complaints match your current filter.</span>
                  </p>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <!-- UNIVERSITY FOOTER -->
      <footer class="admin-footer">
        <p>© Centurion University of Technology and Management | Hostel Grievance Administration</p>
      </footer>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f1f5f9;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
    }

    /* HEADER */
    .admin-header {
      background: linear-gradient(135deg, #002244 0%, #003366 100%);
      color: #ffffff;
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
      border-bottom: 3px solid #f59e0b;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .header-logo {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #ffffff;
      padding: 3px;
      object-fit: contain;
    }

    .header-left h1 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .header-left p {
      margin: 2px 0 0;
      font-size: 0.8rem;
      color: #cbd5e1;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.08);
      padding: 5px 14px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.18);
    }

    .avatar-icon {
      font-size: 1.2rem;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .user-role-label {
      font-size: 0.68rem;
      color: #f59e0b;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .user-meta strong {
      font-size: 0.88rem;
      color: #ffffff;
    }

    .btn-logout {
      background: #dc2626;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: #b91c1c;
    }

    /* MAIN CONTAINER */
    .admin-main {
      max-width: 1320px;
      margin: 24px auto;
      padding: 0 20px 40px;
    }

    /* WELCOME BANNER */
    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 22px 28px;
      border-radius: 12px;
      margin-bottom: 22px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
    }

    .welcome-banner h2 {
      margin: 0;
      font-size: 1.45rem;
      font-weight: 800;
      color: #0f172a;
    }

    .welcome-banner p {
      margin: 4px 0 0;
      font-size: 0.9rem;
      color: #64748b;
    }

    .badge-warden {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
    }

    .badge-super {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
    }

    .badge-admin {
      background: #fdf4ff;
      color: #a21caf;
      border: 1px solid #f5d0fe;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
    }

    /* KPI GRID */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .kpi-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px 22px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
    }

    .kpi-card.kpi-total {
      border-left: 5px solid #003366;
    }

    .kpi-card.kpi-pending {
      border-left: 5px solid #f59e0b;
      background: #fffdf5;
    }

    .kpi-card.kpi-progress {
      border-left: 5px solid #2563eb;
      background: #f8faff;
    }

    .kpi-card.kpi-resolved {
      border-left: 5px solid #10b981;
      background: #f4fbf7;
    }

    .kpi-icon {
      font-size: 2rem;
      background: #f1f5f9;
      width: 52px;
      height: 52px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-content {
      display: flex;
      flex-direction: column;
    }

    .kpi-title {
      font-size: 0.82rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .kpi-number {
      font-size: 2rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
      margin-top: 4px;
    }

    .text-amber {
      color: #d97706 !important;
    }

    .text-blue {
      color: #2563eb !important;
    }

    .text-green {
      color: #059669 !important;
    }

    /* FILTER TOOLBAR */
    .filter-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }

    .filter-grid {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .search-field {
      position: relative;
      flex: 2;
      min-width: 260px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.9rem;
      color: #94a3b8;
    }

    .search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 9px 12px 9px 36px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 0.88rem;
      outline: none;
      transition: border 0.2s;
    }

    .search-input:focus {
      border-color: #003366;
      box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1);
    }

    .filter-select-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .filter-select-wrapper label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .filter-select {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 0.85rem;
      outline: none;
      background: #ffffff;
      cursor: pointer;
    }

    .btn-reset {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-reset:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    /* TABLE CARD */
    .table-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
    }

    .table-header h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: #0f172a;
    }

    .table-subtitle {
      margin: 3px 0 0;
      font-size: 0.82rem;
      color: #64748b;
    }

    .badge-count {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 9999px;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
    }

    .data-table th {
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.73rem;
      letter-spacing: 0.03em;
      padding: 12px 14px;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
      white-space: nowrap;
    }

    .data-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
      color: #334155;
    }

    .data-table tr:hover td {
      background: #f8fafc;
    }

    /* BADGES */
    .id-badge {
      font-weight: 700;
      color: #003366;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .date-badge {
      font-size: 0.78rem;
      color: #64748b;
      font-weight: 600;
      background: #f8fafc;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    .student-name {
      color: #0f172a;
      font-weight: 700;
    }

    .room-tag {
      font-size: 0.8rem;
      color: #475569;
      font-weight: 600;
      white-space: nowrap;
    }

    .category-pill {
      background: #f0fdf4;
      color: #15803d;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid #bbf7d0;
      white-space: nowrap;
    }

    .desc-cell {
      max-width: 220px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #64748b;
      font-size: 0.85rem;
    }

    .warden-pill {
      background: #eff6ff;
      color: #1e40af;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .badge-escalated {
      background: #fee2e2;
      color: #dc2626;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 9999px;
      border: 1px solid #fca5a5;
      white-space: nowrap;
    }

    .badge-routine {
      color: #94a3b8;
      font-size: 0.78rem;
      white-space: nowrap;
    }

    .photo-link {
      color: #003366;
      font-weight: 700;
      font-size: 0.8rem;
      text-decoration: none;
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .photo-link:hover {
      background: #003366;
      color: #ffffff;
    }

    .no-photo-label {
      color: #94a3b8;
      font-size: 0.85rem;
    }

    /* STATUS DROPDOWN PILLS */
    .status-dropdown {
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;
      outline: none;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .status-pending {
      background: #fef3c7;
      color: #b45309;
      border-color: #fde68a;
    }

    .status-progress {
      background: #dbeafe;
      color: #1d4ed8;
      border-color: #bfdbfe;
    }

    .status-resolved {
      background: #dcfce7;
      color: #15803d;
      border-color: #bbf7d0;
    }

    .status-closed {
      background: #f3e8ff;
      color: #7e22ce;
      border-color: #e9d5ff;
    }

    /* EMPTY STATE */
    .empty-state {
      text-align: center;
      padding: 40px !important;
      color: #64748b;
    }

    .empty-icon {
      font-size: 2.4rem;
      margin: 0;
    }

    .empty-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin: 8px 0 4px;
    }

    .empty-sub {
      font-size: 0.88rem;
      color: #94a3b8;
      margin: 0;
    }

    /* FOOTER */
    .admin-footer {
      text-align: center;
      padding: 20px;
      color: #94a3b8;
      font-size: 0.85rem;
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
    }

    .admin-footer p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .admin-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .filter-grid {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {

  currentUserRole: string = 'admin';
  loggedInWarden: string = 'Pramila Dash';

  allComplaints: any[] = [];
  filteredComplaints: any[] = [];

  // Filter state
  searchTerm: string = '';
  selectedCategory: string = 'all';
  selectedStatus: string = 'all';
  selectedWarden: string = 'all';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUserRole = (localStorage.getItem('loggedInRole') || 'admin').toLowerCase();
    this.loggedInWarden = localStorage.getItem('loggedInWarden') || 'Pramila Dash';
    this.loadComplaints();
  }

  isWarden(): boolean {
    return this.currentUserRole === 'warden';
  }

  isSuperintendent(): boolean {
    return this.currentUserRole === 'superintendent';
  }

  isAdmin(): boolean {
    return this.currentUserRole === 'admin';
  }

  getAvatar(): string {
    if (this.isWarden()) return '👩‍🏫';
    if (this.isSuperintendent()) return '👩‍💼';
    return '🏛️';
  }

  getRoleLabel(): string {
    if (this.isWarden()) return 'Resident Warden';
    if (this.isSuperintendent()) return 'Chief Superintendent';
    return 'Hostel Administrator';
  }

  getDisplayName(): string {
    if (this.isWarden()) return this.loggedInWarden;
    if (this.isSuperintendent()) return 'Basanta Manjari Dash';
    return 'System Admin';
  }

  loadComplaints(): void {
    this.http.get<any[]>('http://localhost:8080/complaints').subscribe({
      next: (data) => {
        this.allComplaints = data || [];
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading complaints:', error);
      }
    });
  }

  isEscalated(complaint: any): boolean {
    if (!complaint) return false;
    const sup = (complaint.superintendent || '').trim().toLowerCase();
    return sup !== '' && sup !== 'null' && sup !== 'not sent';
  }

  // Returns complaints allowed for this role
  getScopedComplaints(): any[] {
    // 1. WARDEN: Only sees complaints assigned to HER block
    if (this.isWarden()) {
      const myWarden = this.loggedInWarden.trim().toLowerCase();
      return this.allComplaints.filter(c => (c.warden || '').trim().toLowerCase() === myWarden);
    }

    // 2. SUPERINTENDENT: Only sees complaints where student chose to send to Superintendent!
    if (this.isSuperintendent()) {
      return this.allComplaints.filter(c => this.isEscalated(c));
    }

    // 3. ADMINISTRATOR (admin): Master view across whole campus
    return this.allComplaints;
  }

  applyFilters(): void {
    let result = this.getScopedComplaints();

    // 1. Admin filtering by specific warden
    if (this.isAdmin() && this.selectedWarden !== 'all') {
      const targetWarden = this.selectedWarden.trim().toLowerCase();
      result = result.filter(c => (c.warden || '').trim().toLowerCase() === targetWarden);
    }

    // 2. Search term
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.trim().toLowerCase();
      result = result.filter(c =>
        (c.studentName || '').toLowerCase().includes(q) ||
        (c.roomNumber || '').toLowerCase().includes(q) ||
        (c.block || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.complaintType || '').toLowerCase().includes(q) ||
        String(c.id).includes(q)
      );
    }

    // 3. Category
    if (this.selectedCategory !== 'all') {
      result = result.filter(c => (c.complaintType || '').toLowerCase() === this.selectedCategory.toLowerCase());
    }

    // 4. Status
    if (this.selectedStatus !== 'all') {
      result = result.filter(c => (c.status || 'Pending').toLowerCase() === this.selectedStatus.toLowerCase());
    }

    // Sort newest first
    this.filteredComplaints = result.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedStatus = 'all';
    this.selectedWarden = 'all';
    this.applyFilters();
  }

  updateStatus(complaint: any, newStatus: string): void {
    const params = new HttpParams().set('status', newStatus);

    this.http.put<any>(
      `http://localhost:8080/complaints/${complaint.id}/status`,
      null,
      { params }
    ).subscribe({
      next: () => {
        complaint.status = newStatus;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        complaint.status = newStatus;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateVal: any): string {
    if (!dateVal) return 'Recent';

    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return 'Recent';

      const day = d.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[d.getMonth()];

      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      return `${day} ${month}, ${hours}:${minutes} ${ampm}`;
    } catch {
      return 'Recent';
    }
  }

  getPendingCount(): number {
    return this.getScopedComplaints().filter(
      (c) => (c.status || 'Pending').trim().toLowerCase() === 'pending'
    ).length;
  }

  getInProgressCount(): number {
    return this.getScopedComplaints().filter(
      (c) => (c.status || '').trim().toLowerCase() === 'in progress'
    ).length;
  }

  getResolvedCount(): number {
    return this.getScopedComplaints().filter((c) => {
      const s = (c.status || '').trim().toLowerCase();
      return s === 'resolved' || s === 'closed';
    }).length;
  }

  getStatusSelectClass(status: string): string {
    const s = (status || 'Pending').trim().toLowerCase();
    if (s === 'closed') return 'status-closed';
    if (s === 'resolved') return 'status-resolved';
    if (s === 'in progress') return 'status-progress';
    return 'status-pending';
  }

  logout(): void {
    localStorage.removeItem('loggedInRole');
    localStorage.removeItem('loggedInWarden');
    this.router.navigate(['/login']);
  }
}
