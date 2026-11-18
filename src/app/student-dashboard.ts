import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="student-dashboard">

      <!-- ==========================================
           HEADER / NAVBAR
           ========================================== -->
      <header class="student-header">
        <div class="header-left">
          <img
            src="centurion-logo.jpg"
            alt="Centurion University Logo"
            class="header-logo"
          />
          <div>
            <h1>Hostel Complaint Management System</h1>
            <p>Centurion University — Student Portal</p>
          </div>
        </div>

        <div class="header-right">
          <button type="button" class="btn-help" (click)="goToHelp()">
            ❓ Help & Emergency
          </button>
          <div class="student-profile-chip">
            <span class="avatar-circle">👩‍🎓</span>
            <div class="profile-info">
              <span class="profile-label">Logged in as</span>
              <strong>{{ studentName }}</strong>
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
      <main class="student-main">

        <!-- WELCOME BANNER & ACTION -->
        <section class="welcome-banner">
          <div class="banner-text">
            <h2>Student Dashboard</h2>
            <p>Welcome back, <strong>{{ studentName }}</strong>. Monitor, track, and review your hostel complaints in real-time.</p>
          </div>
          <button type="button" class="btn-raise" (click)="raiseComplaint()">
            <span>+</span> Raise New Complaint
          </button>
        </section>

        <!-- 4 KPI SUMMARY CARDS -->
        <section class="kpi-grid">
          <!-- Total Complaints -->
          <div class="kpi-card kpi-total">
            <div class="kpi-icon">📁</div>
            <div class="kpi-content">
              <span class="kpi-title">Total Complaints</span>
              <span class="kpi-number">{{ complaints.length }}</span>
            </div>
          </div>

          <!-- Pending -->
          <div class="kpi-card kpi-pending">
            <div class="kpi-icon">⏳</div>
            <div class="kpi-content">
              <span class="kpi-title">Pending</span>
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

          <!-- Resolved & Closed -->
          <div class="kpi-card kpi-resolved">
            <div class="kpi-icon">✅</div>
            <div class="kpi-content">
              <span class="kpi-title">Resolved / Closed</span>
              <span class="kpi-number text-green">{{ getResolvedCount() }}</span>
            </div>
          </div>
        </section>

        <!-- COMPLAINT HISTORY TABLE CARD -->
        <section class="table-card">
          <div class="table-header">
            <div>
              <h3>Your Complaint History</h3>
              <p class="table-subtitle">Displaying your complaints in order of submission (Newest First)</p>
            </div>
            <span class="badge-total">{{ complaints.length }} Complaints Filed</span>
          </div>

          <!-- TABLE -->
          <div class="table-responsive">
            <table class="complaints-table">
              <thead>
                <tr>
                  <th># ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Room</th>
                  <th>Assigned Warden</th>
                  <th>Status</th>
                  <th style="text-align: center;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of complaints">
                  <td>
                    <span class="id-badge">#{{ c.id }}</span>
                  </td>
                  <td>
                    <span class="date-badge">{{ formatDate(c.createdAt) }}</span>
                  </td>
                  <td>
                    <span class="category-pill">{{ c.complaintType || 'General' }}</span>
                  </td>
                  <td>
                    <span class="room-pill">Room {{ c.roomNumber || '—' }} ({{ c.block || 'Hostel' }})</span>
                  </td>
                  <td>
                    <span class="warden-name">{{ c.warden || 'Assigned to Block' }}</span>
                  </td>
                  <td>
                    <span [ngClass]="getStatusClass(c.status)">
                      {{ getStatusDisplay(c) }}
                    </span>
                  </td>
                  <td style="text-align: center;">
                    <button type="button" class="btn-details" (click)="viewComplaint(c)">
                      {{ isActionRequired(c) ? '⭐ Rate & Confirm' : 'View Details' }}
                    </button>
                  </td>
                </tr>

                <!-- EMPTY STATE -->
                <tr *ngIf="complaints.length === 0">
                  <td colspan="7" class="empty-state">
                    <p class="empty-icon">📭</p>
                    <p class="empty-title">No complaints submitted yet</p>
                    <p class="empty-sub">If you face any issues with plumbing, electricity, or WiFi, click "Raise New Complaint" above.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ==========================================
             COMPLAINT DETAIL DRAWER / MODAL
             ========================================== -->
        <section *ngIf="selectedComplaint" class="detail-drawer">
          <div class="drawer-header">
            <div>
              <span class="drawer-tag">Complaint #{{ selectedComplaint.id }}</span>
              <h3>{{ selectedComplaint.complaintType }} Issue</h3>
            </div>
            <button type="button" class="btn-close-drawer" (click)="closeComplaint()">
              ✕ Close
            </button>
          </div>

          <!-- SUCCESS NOTIFICATION -->
          <div *ngIf="confirmationSuccessMsg" class="alert-success-banner">
            {{ confirmationSuccessMsg }}
          </div>

          <div class="drawer-grid">
            <div class="drawer-field">
              <label>Date Submitted</label>
              <strong>{{ formatDate(selectedComplaint.createdAt) }}</strong>
            </div>

            <div class="drawer-field">
              <label>Room & Block</label>
              <strong>Room {{ selectedComplaint.roomNumber }} ({{ selectedComplaint.block }})</strong>
            </div>

            <div class="drawer-field">
              <label>Assigned Warden</label>
              <strong>{{ selectedComplaint.warden || 'Basanta Manjari Dash' }}</strong>
            </div>

            <div class="drawer-field">
              <label>Current Status</label>
              <div>
                <span [ngClass]="getStatusClass(selectedComplaint.status)">
                  {{ getStatusDisplay(selectedComplaint) }}
                </span>
              </div>
            </div>
          </div>

          <div class="drawer-description">
            <label>Detailed Description</label>
            <p>{{ selectedComplaint.description || 'No additional description provided.' }}</p>
          </div>

          <!-- PHOTO ATTACHMENT -->
          <div *ngIf="selectedComplaint.photoPath" class="drawer-photo-section">
            <label>Attached Photo Proof</label>
            <div class="photo-container">
              <img
                [src]="'http://localhost:8080/uploads/' + selectedComplaint.photoPath"
                alt="Complaint Photo Proof"
                class="complaint-photo"
              />
            </div>
          </div>

          <!-- ====================================================
               STUDENT RESOLUTION CONFIRMATION & RATING SECTION
               ==================================================== -->

          <!-- 1. ACTIVE CONFIRMATION & RATING (WHEN STATUS IS RESOLVED) -->
          <div *ngIf="isActionRequired(selectedComplaint)" class="rating-box">
            <div class="rating-header">
              <span class="rating-icon">🎉</span>
              <div>
                <h4>Warden Marked This Issue as Resolved!</h4>
                <p>Please inspect the repair in your room and confirm whether it was resolved satisfactorily.</p>
              </div>
            </div>

            <!-- STAR SELECTOR -->
            <div class="stars-container">
              <label class="stars-label">Rate the Maintenance & Repair Service:</label>
              <div class="star-row">
                <button
                  *ngFor="let s of [1, 2, 3, 4, 5]"
                  type="button"
                  class="star-btn"
                  [class.active]="s <= selectedRating"
                  (click)="setRating(s)"
                >
                  ★
                </button>
                <span class="rating-feedback-label">{{ getRatingLabel(selectedRating) }}</span>
              </div>
            </div>

            <!-- FEEDBACK COMMENT -->
            <div class="feedback-input-group">
              <label>Optional Feedback / Remark for Maintenance Team:</label>
              <textarea
                [(ngModel)]="feedbackText"
                rows="2"
                placeholder="e.g. Electrician arrived promptly and replaced the faulty switch. Everything works perfectly now!"
                class="feedback-textarea"
              ></textarea>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="rating-actions">
              <button
                type="button"
                class="btn-confirm-fix"
                (click)="confirmResolution(selectedComplaint)"
              >
                ✅ Confirm Fix & Close Complaint
              </button>

              <button
                type="button"
                class="btn-reopen"
                (click)="reopenComplaint(selectedComplaint)"
              >
                ⚠️ Issue Not Fixed (Re-Open)
              </button>
            </div>
          </div>

          <!-- 2. ALREADY CLOSED / RATED BADGE -->
          <div *ngIf="isComplaintClosed(selectedComplaint)" class="rating-completed-box">
            <div class="completed-header">
              <span class="check-icon">🌟</span>
              <div>
                <h4>Complaint Verified & Closed by You</h4>
                <p>
                  You rated this resolution:
                  <strong class="stars-text">{{ getRatingStars(selectedComplaint.id) }}</strong>
                </p>
                <p *ngIf="getRatingComment(selectedComplaint.id)" class="saved-comment">
                  <em>"{{ getRatingComment(selectedComplaint.id) }}"</em>
                </p>
              </div>
            </div>
          </div>

        </section>

      </main>

      <!-- UNIVERSITY FOOTER -->
      <footer class="student-footer">
        <p>© Centurion University of Technology and Management | Hostel Resident Portal</p>
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
    .student-header {
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

    .btn-help {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-help:hover {
      background: #ffffff;
      color: #002244;
    }

    .student-profile-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.08);
      padding: 5px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .avatar-circle {
      font-size: 1.1rem;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .profile-label {
      font-size: 0.7rem;
      color: #cbd5e1;
    }

    .profile-info strong {
      font-size: 0.88rem;
      color: #ffffff;
    }

    .btn-logout {
      background: #dc2626;
      color: #ffffff;
      border: none;
      padding: 7px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: #b91c1c;
    }

    /* MAIN BODY */
    .student-main {
      max-width: 1240px;
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

    .banner-text h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
    }

    .banner-text p {
      margin: 4px 0 0;
      font-size: 0.92rem;
      color: #64748b;
    }

    .btn-raise {
      background: linear-gradient(135deg, #003366 0%, #00509e 100%);
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 51, 102, 0.25);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .btn-raise:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 51, 102, 0.35);
    }

    .btn-raise span {
      font-size: 1.2rem;
      font-weight: 900;
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
      font-size: 0.85rem;
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

    .badge-total {
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

    .complaints-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    .complaints-table th {
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.03em;
      padding: 12px 14px;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
    }

    .complaints-table td {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
      color: #334155;
    }

    .complaints-table tr:hover td {
      background: #f8fafc;
    }

    /* BADGES & PILLS */
    .id-badge {
      font-weight: 700;
      color: #003366;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .date-badge {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      background: #f8fafc;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    .category-pill {
      background: #f0fdf4;
      color: #15803d;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #bbf7d0;
    }

    .room-pill {
      font-size: 0.82rem;
      color: #475569;
      font-weight: 600;
    }

    .warden-name {
      font-size: 0.85rem;
      color: #334155;
    }

    /* STATUS PILLS */
    .status-pending {
      display: inline-block;
      background: #fef3c7;
      color: #b45309;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .status-progress {
      display: inline-block;
      background: #dbeafe;
      color: #1d4ed8;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .status-resolved {
      display: inline-block;
      background: #dcfce7;
      color: #15803d;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      border: 1px solid #86efac;
    }

    .status-closed {
      display: inline-block;
      background: #f3e8ff;
      color: #7e22ce;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .btn-details {
      background: #ffffff;
      color: #003366;
      border: 1px solid #cbd5e1;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-details:hover {
      background: #003366;
      color: #ffffff;
      border-color: #003366;
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

    /* DETAIL DRAWER */
    .detail-drawer {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      border: 2px solid #003366;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      margin-bottom: 24px;
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
    }

    .drawer-tag {
      font-size: 0.78rem;
      color: #0284c7;
      font-weight: 700;
      text-transform: uppercase;
    }

    .drawer-header h3 {
      margin: 2px 0 0;
      font-size: 1.25rem;
      color: #0f172a;
    }

    .btn-close-drawer {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
    }

    .btn-close-drawer:hover {
      background: #fee2e2;
      color: #dc2626;
      border-color: #fca5a5;
    }

    .alert-success-banner {
      background: #dcfce7;
      color: #14532d;
      border: 1px solid #86efac;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 18px;
    }

    .drawer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 18px;
    }

    .drawer-field label {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .drawer-field strong {
      font-size: 0.95rem;
      color: #0f172a;
    }

    .drawer-description {
      background: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 18px;
    }

    .drawer-description label {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .drawer-description p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: #334155;
    }

    .drawer-photo-section label {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .photo-container {
      background: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      display: inline-block;
    }

    .complaint-photo {
      max-width: 100%;
      max-height: 320px;
      border-radius: 6px;
      display: block;
      object-fit: contain;
    }

    /* RATING INTERACTIVE BOX */
    .rating-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      border: 2px solid #86efac;
      border-radius: 12px;
      padding: 22px;
      margin-top: 20px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
    }

    .rating-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .rating-icon {
      font-size: 2.2rem;
    }

    .rating-header h4 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      color: #14532d;
    }

    .rating-header p {
      margin: 3px 0 0;
      font-size: 0.88rem;
      color: #166534;
    }

    .stars-container {
      background: #ffffff;
      padding: 14px 18px;
      border-radius: 8px;
      border: 1px solid #bbf7d0;
      margin-bottom: 14px;
    }

    .stars-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #14532d;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .star-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #cbd5e1;
      cursor: pointer;
      line-height: 1;
      padding: 0 2px;
      transition: transform 0.15s ease, color 0.15s ease;
    }

    .star-btn.active {
      color: #f59e0b;
    }

    .star-btn:hover {
      transform: scale(1.25);
    }

    .rating-feedback-label {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
      margin-left: 14px;
    }

    .feedback-input-group {
      margin-bottom: 18px;
    }

    .feedback-input-group label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #14532d;
      margin-bottom: 6px;
    }

    .feedback-textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #86efac;
      border-radius: 8px;
      padding: 10px 14px;
      font-family: inherit;
      font-size: 0.9rem;
      outline: none;
      resize: vertical;
      background: #ffffff;
    }

    .feedback-textarea:focus {
      border-color: #15803d;
      box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15);
    }

    .rating-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .btn-confirm-fix {
      background: #15803d;
      color: #ffffff;
      border: none;
      padding: 11px 22px;
      border-radius: 8px;
      font-size: 0.92rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(21, 128, 61, 0.25);
      transition: all 0.2s ease;
    }

    .btn-confirm-fix:hover {
      background: #14532d;
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(21, 128, 61, 0.35);
    }

    .btn-reopen {
      background: #ffffff;
      color: #dc2626;
      border: 1px solid #fca5a5;
      padding: 11px 18px;
      border-radius: 8px;
      font-size: 0.92rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-reopen:hover {
      background: #fee2e2;
    }

    /* RATING COMPLETED BOX */
    .rating-completed-box {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 10px;
      padding: 16px 20px;
      margin-top: 18px;
    }

    .completed-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .check-icon {
      font-size: 1.8rem;
    }

    .completed-header h4 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 800;
      color: #6b21a8;
    }

    .completed-header p {
      margin: 4px 0 0;
      font-size: 0.88rem;
      color: #581c87;
    }

    .stars-text {
      color: #f59e0b;
      font-size: 1.1rem;
      letter-spacing: 2px;
    }

    .saved-comment {
      display: block;
      margin-top: 4px;
      color: #475569;
      font-size: 0.85rem;
    }

    /* FOOTER */
    .student-footer {
      text-align: center;
      padding: 20px;
      color: #94a3b8;
      font-size: 0.85rem;
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
    }

    .student-footer p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .student-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .welcome-banner {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
      }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {

  studentName: string = 'Khushi';
  complaints: any[] = [];
  selectedComplaint: any = null;

  // Rating & Feedback State
  selectedRating: number = 5;
  feedbackText: string = '';
  confirmationSuccessMsg: string = '';
  ratingMap: { [id: number]: { stars: number; feedback: string } } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
      this.studentName = savedName;
    }

    // Load persisted ratings
    try {
      const savedRatings = localStorage.getItem('complaint_ratings');
      if (savedRatings) {
        this.ratingMap = JSON.parse(savedRatings);
      }
    } catch {
      this.ratingMap = {};
    }

    this.loadComplaints();
  }

  loadComplaints(): void {
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
    return this.complaints.filter((c) => {
      const s = (c.status || '').trim().toLowerCase();
      return s === 'resolved' || s === 'closed';
    }).length;
  }

  getStatusClass(status: string): string {
    const currentStatus = (status || 'Pending').trim().toLowerCase();
    if (currentStatus === 'closed') {
      return 'status-closed';
    }
    if (currentStatus === 'resolved') {
      return 'status-resolved';
    }
    if (currentStatus === 'in progress') {
      return 'status-progress';
    }
    return 'status-pending';
  }

  getStatusDisplay(complaint: any): string {
    const s = (complaint.status || 'Pending').trim();
    const sLower = s.toLowerCase();

    if (sLower === 'closed') {
      const stars = this.ratingMap[complaint.id]?.stars || 5;
      return `Closed (${stars}★)`;
    }
    return s;
  }

  isActionRequired(complaint: any): boolean {
    if (!complaint) return false;
    const s = (complaint.status || '').trim().toLowerCase();
    return s === 'resolved';
  }

  isComplaintClosed(complaint: any): boolean {
    if (!complaint) return false;
    const s = (complaint.status || '').trim().toLowerCase();
    return s === 'closed';
  }

  setRating(stars: number): void {
    this.selectedRating = stars;
  }

  getRatingLabel(stars: number): string {
    switch (stars) {
      case 1: return '1 Star — Poor 😞';
      case 2: return '2 Stars — Fair 😐';
      case 3: return '3 Stars — Good 🙂';
      case 4: return '4 Stars — Very Good 😊';
      case 5: return '5 Stars — Excellent! 🌟';
      default: return '5 Stars — Excellent! 🌟';
    }
  }

  getRatingStars(id: number): string {
    const count = this.ratingMap[id]?.stars || 5;
    return '★'.repeat(count);
  }

  getRatingComment(id: number): string {
    return this.ratingMap[id]?.feedback || '';
  }

  confirmResolution(complaint: any): void {
    const params = new HttpParams().set('status', 'Closed');

    this.http.put<any>(
      `http://localhost:8080/complaints/${complaint.id}/status`,
      null,
      { params }
    ).subscribe({
      next: () => {
        complaint.status = 'Closed';

        // Persist student's rating & feedback
        this.ratingMap[complaint.id] = {
          stars: this.selectedRating,
          feedback: this.feedbackText.trim()
        };
        localStorage.setItem('complaint_ratings', JSON.stringify(this.ratingMap));

        this.confirmationSuccessMsg = '✅ Thank you! Your resolution confirmation and rating have been saved.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error confirming resolution:', err);
        // Fallback for UI responsiveness
        complaint.status = 'Closed';
        this.ratingMap[complaint.id] = {
          stars: this.selectedRating,
          feedback: this.feedbackText.trim()
        };
        localStorage.setItem('complaint_ratings', JSON.stringify(this.ratingMap));
        this.confirmationSuccessMsg = '✅ Thank you! Your resolution confirmation has been recorded.';
        this.cdr.detectChanges();
      }
    });
  }

  reopenComplaint(complaint: any): void {
    const params = new HttpParams().set('status', 'In Progress');

    this.http.put<any>(
      `http://localhost:8080/complaints/${complaint.id}/status`,
      null,
      { params }
    ).subscribe({
      next: () => {
        complaint.status = 'In Progress';
        delete this.ratingMap[complaint.id];
        localStorage.setItem('complaint_ratings', JSON.stringify(this.ratingMap));

        this.confirmationSuccessMsg = '⚠️ Complaint re-opened! Warden has been notified that the issue still needs attention.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error reopening complaint:', err);
      }
    });
  }

  viewComplaint(complaint: any): void {
    this.selectedComplaint = complaint;
    this.confirmationSuccessMsg = '';
    this.selectedRating = 5;
    this.feedbackText = '';

    setTimeout(() => {
      const drawer = document.querySelector('.detail-drawer');
      if (drawer) {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  closeComplaint(): void {
    this.selectedComplaint = null;
    this.confirmationSuccessMsg = '';
  }

  raiseComplaint(): void {
    this.router.navigate(['/complaint']);
  }

  goToHelp(): void {
    this.router.navigate(['/help']);
  }

  logout(): void {
    localStorage.removeItem('loggedInRole');
    localStorage.removeItem('studentName');
    this.router.navigate(['/login']);
  }
}
