import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="help-container">

      <!-- ==========================================
           HEADER / NAVBAR
           ========================================== -->
      <header class="help-header">
        <div class="header-content">
          <div class="brand-group">
            <img
              src="centurion-logo.jpg"
              alt="Centurion University Logo"
              class="university-logo"
            />
            <div class="brand-text">
              <h1>Centurion University Hostel Portal</h1>
              <p>Help, Emergency Contacts & Redressal Guidelines</p>
            </div>
          </div>
          <button type="button" class="btn-back" (click)="goBack()">
            ← Back to Portal
          </button>
        </div>
      </header>

      <!-- ==========================================
           MAIN CONTENT
           ========================================== -->
      <main class="help-body">

        <!-- INTRO HERO -->
        <section class="hero-section">
          <h2>Hostel Resident Support Desk</h2>
          <p>
            Need assistance or have an urgent query? Use the contacts and guidelines below to reach the right hostel authorities quickly.
          </p>
        </section>

        <!-- 24/7 EMERGENCY CONTACTS -->
        <section class="section-block">
          <div class="section-title-bar emergency-bar">
            <span class="icon">🚨</span>
            <h3>24/7 Emergency Contacts (Campus-Wide)</h3>
          </div>

          <div class="cards-grid emergency-grid">
            <div class="info-card alert-card">
              <div class="card-icon">🚑</div>
              <h4>Campus Medical & Ambulance</h4>
              <p class="role-desc">Health Center (24/7 On-Duty Doctor & Nurse)</p>
              <a href="tel:9938874500" class="phone-link">+91 99388 74500</a>
            </div>

            <div class="info-card alert-card">
              <div class="card-icon">🛡️</div>
              <h4>Hostel Main Security Gate</h4>
              <p class="role-desc">Security Supervisor & Night Duty Guard</p>
              <a href="tel:9938874501" class="phone-link">+91 99388 74501</a>
            </div>

            <div class="info-card alert-card">
              <div class="card-icon">⚡</div>
              <h4>Emergency Maintenance Desk</h4>
              <p class="role-desc">Immediate Power Failure & Water Line Bursts</p>
              <a href="tel:9938874502" class="phone-link">+91 99388 74502</a>
            </div>
          </div>
        </section>

        <!-- ADMINISTRATION & WARDENS -->
        <section class="section-block">
          <div class="section-title-bar">
            <span class="icon">🏢</span>
            <h3>Hostel Administration & Resident Wardens</h3>
          </div>

          <!-- SUPERINTENDENT CARD -->
          <div class="superintendent-card">
            <div class="super-avatar">👩‍💼</div>
            <div class="super-details">
              <span class="badge-super">Chief Hostel Superintendent</span>
              <h4>Basanta Manjari Dash</h4>
              <p>Overall hostel administration, discipline, leave approvals & grievance escalation.</p>
              <div class="contact-chips">
                <a href="tel:9938874573" class="chip">📞 +91 99388 74573</a>
                <a href="mailto:hostel.admin@cutm.ac.in" class="chip">✉️ hostel.admin&#64;cutm.ac.in</a>
                <span class="chip location">📍 Office: Admin Block, Room 102</span>
              </div>
            </div>
          </div>

          <!-- WARDENS GRID -->
          <div class="cards-grid warden-grid">
            <div class="info-card">
              <span class="block-tag">Block A</span>
              <h4>Pramila Dash</h4>
              <p class="role-desc">Resident Warden (Ground & 1st Floor)</p>
              <a href="tel:9437112301" class="phone-link">📞 +91 94371 12301</a>
            </div>

            <div class="info-card">
              <span class="block-tag">Block B</span>
              <h4>Binod Manjari</h4>
              <p class="role-desc">Resident Warden (2nd & 3rd Floor)</p>
              <a href="tel:9437112302" class="phone-link">📞 +91 94371 12302</a>
            </div>

            <div class="info-card">
              <span class="block-tag">Block C</span>
              <h4>Parbati Mahapatra</h4>
              <p class="role-desc">Resident Warden (General Facilities)</p>
              <a href="tel:9437112303" class="phone-link">📞 +91 94371 12303</a>
            </div>

            <div class="info-card">
              <span class="block-tag">Mess & Dining</span>
              <h4>Rashmi Rekha Swain</h4>
              <p class="role-desc">Mess In-Charge & Food Quality</p>
              <a href="tel:9437112304" class="phone-link">📞 +91 94371 12304</a>
            </div>

            <div class="info-card">
              <span class="block-tag">Night Duty</span>
              <h4>Kanaklata Jena</h4>
              <p class="role-desc">Night Attendance & Health Check</p>
              <a href="tel:9437112305" class="phone-link">📞 +91 94371 12305</a>
            </div>
          </div>
        </section>

        <!-- EXPECTED RESOLUTION TIMELINES -->
        <section class="section-block">
          <div class="section-title-bar">
            <span class="icon">⏱️</span>
            <h3>Standard Complaint Resolution Timelines (SLA)</h3>
          </div>

          <div class="sla-grid">
            <div class="sla-card">
              <div class="sla-icon">⚡</div>
              <div class="sla-info">
                <h4>Electricity & Power</h4>
                <p>Fan, light bulb, power socket, switchboard</p>
              </div>
              <div class="sla-badge fast">Max 4 Hours</div>
            </div>

            <div class="sla-card">
              <div class="sla-icon">💧</div>
              <div class="sla-info">
                <h4>Water & Plumbing</h4>
                <p>Tap leakage, geyser, flush, bathroom drain</p>
              </div>
              <div class="sla-badge fast">Max 6 Hours</div>
            </div>

            <div class="sla-card">
              <div class="sla-icon">📶</div>
              <div class="sla-info">
                <h4>WiFi & Internet</h4>
                <p>LAN port, corridor WiFi router, connectivity</p>
              </div>
              <div class="sla-badge medium">Within 24 Hours</div>
            </div>

            <div class="sla-card">
              <div class="sla-icon">🪑</div>
              <div class="sla-info">
                <h4>Carpentry & Furniture</h4>
                <p>Bed, study table, chair, door lock, cupboard</p>
              </div>
              <div class="sla-badge normal">Within 48 Hours</div>
            </div>
          </div>
        </section>

        <!-- COMPLAINT REDRESSAL PROCEDURE -->
        <section class="section-block">
          <div class="section-title-bar">
            <span class="icon">📋</span>
            <h3>Complaint Process & Escalation Policy</h3>
          </div>

          <div class="policy-card">
            <ol class="policy-steps">
              <li>
                <strong>Step 1 — Online Submission:</strong> Register your issue through the
                <em>Student Dashboard</em>. Uploading a photo helps technicians resolve it faster.
              </li>
              <li>
                <strong>Step 2 — Warden Assignment:</strong> Your assigned block warden reviews and
                assigns the task to the respective technician within 2 hours.
              </li>
              <li>
                <strong>Step 3 — Resolution & Status:</strong> Once repaired, status updates to
                <em>"Resolved"</em>. Students can verify the fix in their dashboard.
              </li>
              <li>
                <strong>Step 4 — Escalation:</strong> If an issue remains unaddressed beyond the SLA timeline,
                it is automatically reviewed during the Superintendent's daily audit.
              </li>
            </ol>
            <div class="anti-ragging-notice">
              🛡️ <strong>Zero Tolerance Notice:</strong> Ragging, harassment, or unauthorized room entry are strictly forbidden under university anti-ragging regulations.
            </div>
          </div>
        </section>

        <!-- FOOTER BACK BUTTON -->
        <div class="footer-actions">
          <button type="button" class="btn-primary" (click)="goBack()">
            ← Return to Dashboard
          </button>
        </div>

      </main>

      <!-- UNIVERSITY FOOTER -->
      <footer class="help-footer">
        <p>© Centurion University of Technology and Management | Hostel Administration</p>
      </footer>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
    }

    /* HEADER */
    .help-header {
      background: linear-gradient(135deg, #002244 0%, #003366 100%);
      color: #ffffff;
      padding: 16px 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-bottom: 3px solid #f59e0b;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .university-logo {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: #ffffff;
      padding: 3px;
      object-fit: contain;
    }

    .brand-text h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .brand-text p {
      margin: 2px 0 0;
      font-size: 0.85rem;
      color: #cbd5e1;
    }

    .btn-back {
      background-color: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 9px 18px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-back:hover {
      background-color: #ffffff;
      color: #002244;
    }

    /* BODY CONTAINER */
    .help-body {
      max-width: 1200px;
      margin: 28px auto;
      padding: 0 20px 40px;
    }

    /* HERO */
    .hero-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .hero-section h2 {
      margin: 0;
      font-size: 1.85rem;
      font-weight: 800;
      color: #0f172a;
    }

    .hero-section p {
      margin: 8px auto 0;
      font-size: 1rem;
      color: #64748b;
      max-width: 650px;
    }

    /* SECTION BLOCKS */
    .section-block {
      background: #ffffff;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
    }

    .section-title-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f1f5f9;
    }

    .section-title-bar.emergency-bar {
      border-bottom-color: #fee2e2;
    }

    .section-title-bar .icon {
      font-size: 1.4rem;
    }

    .section-title-bar h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
    }

    /* CARDS GRID */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 18px;
      position: relative;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
    }

    .info-card.alert-card {
      background: #fffdf5;
      border-color: #fef08a;
    }

    .card-icon {
      font-size: 1.6rem;
      margin-bottom: 8px;
    }

    .info-card h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
    }

    .role-desc {
      margin: 6px 0 12px;
      font-size: 0.85rem;
      color: #64748b;
      min-height: 38px;
    }

    .phone-link {
      display: inline-block;
      color: #003366;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      padding: 6px 12px;
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      transition: all 0.2s ease;
    }

    .phone-link:hover {
      background: #003366;
      color: #ffffff;
      border-color: #003366;
    }

    .block-tag {
      position: absolute;
      top: 14px;
      right: 14px;
      background: #e0f2fe;
      color: #0284c7;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
    }

    /* SUPERINTENDENT CARD */
    .superintendent-card {
      display: flex;
      gap: 20px;
      align-items: center;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 22px;
      margin-bottom: 20px;
    }

    .super-avatar {
      font-size: 2.8rem;
      background: #ffffff;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
      flex-shrink: 0;
    }

    .super-details h4 {
      margin: 4px 0;
      font-size: 1.25rem;
      font-weight: 800;
      color: #14532d;
    }

    .super-details p {
      margin: 2px 0 12px;
      font-size: 0.9rem;
      color: #166534;
    }

    .badge-super {
      display: inline-block;
      background: #15803d;
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .contact-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      background: #ffffff;
      color: #14532d;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid #86efac;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .chip.location {
      background: #f8fafc;
      color: #475569;
      border-color: #cbd5e1;
    }

    /* SLA GRID */
    .sla-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .sla-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
    }

    .sla-icon {
      font-size: 1.8rem;
      flex-shrink: 0;
    }

    .sla-info {
      flex: 1;
    }

    .sla-info h4 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }

    .sla-info p {
      margin: 3px 0 0;
      font-size: 0.8rem;
      color: #64748b;
    }

    .sla-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .sla-badge.fast {
      background: #dcfce7;
      color: #15803d;
    }

    .sla-badge.medium {
      background: #fef3c7;
      color: #b45309;
    }

    .sla-badge.normal {
      background: #e0e7ff;
      color: #4338ca;
    }

    /* POLICY STEPS */
    .policy-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 20px 24px;
    }

    .policy-steps {
      margin: 0 0 16px 20px;
      padding: 0;
      color: #334155;
      font-size: 0.92rem;
      line-height: 1.6;
    }

    .policy-steps li {
      margin-bottom: 8px;
    }

    .anti-ragging-notice {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      color: #9f1239;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.88rem;
      line-height: 1.4;
    }

    /* FOOTER ACTIONS */
    .footer-actions {
      text-align: center;
      margin-top: 28px;
    }

    .btn-primary {
      background: #003366;
      color: #ffffff;
      border: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 51, 102, 0.2);
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      background: #002244;
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0, 51, 102, 0.3);
    }

    /* FOOTER */
    .help-footer {
      text-align: center;
      padding: 20px;
      color: #94a3b8;
      font-size: 0.85rem;
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
    }

    .help-footer p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      .superintendent-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class HelpComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goBack(): void {
    const role = (localStorage.getItem('loggedInRole') || '').toLowerCase();

    if (role === 'student') {
      this.router.navigate(['/student-dashboard']);
    } else if (role === 'warden' || role === 'superintendent' || role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
