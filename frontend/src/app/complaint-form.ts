
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
export class ComplaintFormComponent {

  studentName = '';
  roomNumber = '';
  block = '';
  warden = '';

  superintendent = 'Basanta Manjari Dash';
  sendToSuperintendent = false;

  complaintType = '';
  description = '';

  photo: File | null = null;

  isSubmitting = false;

  constructor(private http: HttpClient) {}

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];
    }
  }

  submitComplaint() {

    // Prevent duplicate submissions
    if (this.isSubmitting) {
      return;
    }

    // Check required text fields
    if (
      !this.studentName.trim() ||
      !this.roomNumber.trim() ||
      !this.block ||
      !this.warden ||
      !this.complaintType ||
      !this.description.trim()
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check minimum meaningful description length
    if (this.description.trim().length < 10) {
      alert('Complaint description must contain at least 10 characters.');
      return;
    }

    const complaint = {
      studentName: this.studentName.trim(),
      roomNumber: this.roomNumber.trim(),
      block: this.block,
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
      new Blob(
        [JSON.stringify(complaint)],
        { type: 'application/json' }
      )
    );

    if (this.photo) {
      formData.append('photo', this.photo);
    }

    this.isSubmitting = true;

    this.http.post(
      'http://localhost:8080/complaints',
      formData
    ).subscribe({

      next: (response) => {

        console.log(
          'Complaint submitted:',
          response
        );

        localStorage.setItem(
          'studentName',
          this.studentName.trim()
        );

        alert('Complaint submitted successfully!');

        this.studentName = '';
        this.roomNumber = '';
        this.block = '';
        this.warden = '';
        this.complaintType = '';
        this.description = '';
        this.photo = null;

        this.sendToSuperintendent = false;
        this.superintendent = 'Basanta Manjari Dash';

        this.isSubmitting = false;
      },

      error: (error) => {

        console.error(
          'Error submitting complaint:',
          error
        );

        alert('Failed to submit complaint.');

        this.isSubmitting = false;
      }
    });
  }
}
