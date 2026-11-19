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

  studentName: string = '';
  roomNumber: string = '';
  block: string = 'Hostel';
  warden: string = '';

  superintendent: string = 'Basanta Manjari Dash';
  sendToSuperintendent: boolean = false;

  complaintType: string = '';
  description: string = '';

  photo: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pre-fill student name if already logged in
    const savedName = localStorage.getItem('studentName');
    if (savedName && savedName !== 'null') {
      this.studentName = savedName;
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];
    }
  }

  submitComplaint(): void {
    if (!this.studentName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!this.roomNumber.trim()) {
      alert('Please enter your room number.');
      return;
    }

    if (!this.warden) {
      alert('Please select your assigned warden.');
      return;
    }

    if (!this.complaintType) {
      alert('Please select a complaint category.');
      return;
    }

    if (!this.description.trim()) {
      alert('Please provide a description of the issue.');
      return;
    }

    this.isSubmitting = true;

    const complaint = {
      studentName: this.studentName.trim(),
      roomNumber: this.roomNumber.trim(),
      block: this.block || 'Hostel',
      warden: this.warden,

      superintendent: this.sendToSuperintendent
        ? this.superintendent
        : null,

      complaintType: this.complaintType,
      description: this.description.trim(),
      photoViewed: false
    };

    const formData = new FormData();
    formData.append(
      'complaint',
      new Blob([JSON.stringify(complaint)], { type: 'application/json' })
    );

    if (this.photo) {
      formData.append('photo', this.photo);
    }

    this.http.post('http://localhost:8080/complaints', formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        // Save student credentials so their dashboard immediately shows the new complaint
        localStorage.setItem('studentName', this.studentName.trim());
        localStorage.setItem('loggedInRole', 'student');

        alert('✅ Complaint submitted successfully! Redirecting to your dashboard...');
        this.router.navigate(['/student-dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error submitting complaint:', error);
        alert('❌ Failed to submit complaint. Please check your backend connection.');
      }
    });
  }
}
