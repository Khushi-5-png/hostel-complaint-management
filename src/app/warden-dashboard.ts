import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-warden-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="dashboard">

      <h1>Warden Dashboard</h1>
      <p class="subtitle">Complaints assigned to Pramila Dash</p>

      <div
        class="complaint-card"
        *ngFor="let complaint of complaints"
      >

        <h2>Complaint #{{ complaint.id }}</h2>

        <p>
          <strong>Student:</strong>
          {{ complaint.studentName || 'Not provided' }}
        </p>

        <p>
          <strong>Room:</strong>
          {{ complaint.roomNumber || 'Not provided' }}
        </p>

        <p>
          <strong>Block:</strong>
          {{ complaint.block || 'Not provided' }}
        </p>

        <p>
          <strong>Warden:</strong>
          {{ complaint.warden || 'Not provided' }}
        </p>

        <p>
          <strong>Complaint Type:</strong>
          {{ complaint.complaintType || 'Not provided' }}
        </p>

        <p>
          <strong>Description:</strong>
          {{ complaint.description || 'Not provided' }}
        </p>

        <p>
          <strong>Superintendent:</strong>
          {{ complaint.superintendent || 'Not sent' }}
        </p>

        <div *ngIf="complaint.photoPath" class="photo-section">
          <strong>Photo:</strong>
          <br><br>

          <a
            [href]="'http://localhost:8080/complaints/photo/' + complaint.photoPath.split('/').pop()"
            target="_blank"
          >
            View Photo
          </a>
        </div>

        <p *ngIf="!complaint.photoPath">
          <strong>Photo:</strong> No photo uploaded
        </p>

      </div>

      <p *ngIf="complaints.length === 0">
        No complaints assigned to Pramila Dash.
      </p>

    </div>
  `
})
export class WardenDashboardComponent implements OnInit {

  complaints: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadComplaints();
  }

  loadComplaints() {
    this.http.get<any[]>(
      'http://localhost:8080/complaints'
    ).subscribe({
      next: (data) => {

        this.complaints = data.filter(
          complaint => complaint.warden === 'Pramila Dash'
        );

        console.log(
          'Pramila Dash complaints:',
          this.complaints
        );
      },

      error: (error) => {
        console.error('Error loading complaints:', error);
      }
    });
  }
}
