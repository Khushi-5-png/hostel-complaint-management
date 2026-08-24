import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  studentName = '';
  roomNumber = '';
  block = '';
  warden = '';
  superintendent = 'Basanta Manjari Dash';
  complaintType = '';
  description = '';
  photo: File | null = null;
  sendToSuperintendent = false;

  complaints: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadComplaints();
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
      new Blob([JSON.stringify(complaint)], {
        type: 'application/json'
      })
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

        this.studentName = '';
        this.roomNumber = '';
        this.block = '';
        this.warden = '';
        this.complaintType = '';
        this.description = '';
        this.photo = null;
        this.sendToSuperintendent = false;
        this.superintendent = 'Basanta Manjari Dash';

        this.loadComplaints();
      },
      error: (error) => {
        console.error('Error submitting complaint:', error);
        alert('Failed to submit complaint.');
      }
    });
  }

  loadComplaints() {
    this.http.get<any[]>(
      'http://localhost:8080/complaints'
    ).subscribe({
      next: (data) => {
        this.complaints = data;
        console.log('Complaints loaded:', data);
      },
      error: (error) => {
        console.error('Error loading complaints:', error);
      }
    });
  }
}
