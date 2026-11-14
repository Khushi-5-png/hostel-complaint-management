import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './complaint-form.html',
  styleUrl: './app.css'
})
export class ComplaintFormComponent implements OnInit {

  studentName = '';
  roomNumber = '';
  block = '';
  warden = '';

  superintendent = 'Basanta Manjari Dash';
  sendToSuperintendent = false;

  complaintType = '';
  description = '';

  photo: File | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // 1. Auto-fill student name from the login session
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
      this.studentName = savedName;
    }
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];
    }
  }

  submitComplaint() {

    const complaint = {
      studentName: this.studentName,
      roomNumber: this.roomNumber,
      block: this.block,
      warden: this.warden,
      superintendent: this.sendToSuperintendent
        ? this.superintendent
        : null,
      complaintType: this.complaintType,
      description: this.description,
      photoViewed: false
    };

    const formData = new FormData();

    formData.append(
      'complaint',
      new Blob(
        [JSON.stringify(complaint)],
        { type: 'application/json' }
      )
    );

    if (this.photo) {
      formData.append('photo', this.photo);
    }

    this.http.post(
      'http://localhost:8080/complaints',
      formData
    ).subscribe({
      next: (response) => {
        console.log('Complaint submitted:', response);

        alert('Complaint submitted successfully!');

        // Automatically take student back to her dashboard to see her complaint!
        this.router.navigate(['/student-dashboard']);
      },
      error: (error) => {
        console.error('Error submitting complaint:', error);
        alert('Failed to submit complaint. Please check your connection.');
      }
    });
  }
}
