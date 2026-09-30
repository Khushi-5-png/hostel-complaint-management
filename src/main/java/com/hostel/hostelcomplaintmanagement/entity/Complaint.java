package com.hostel.hostelcomplaintmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String roomNumber;
    private String block;
    private String warden;
    private String superintendent;

    private Boolean photoViewed = false;

    private String complaintType;
    private String description;
    private String photoPath;

    // Complaint status
    private String status = "Pending";

    public Complaint() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public String getWarden() {
        return warden;
    }

    public void setWarden(String warden) {
        this.warden = warden;
    }

    public String getSuperintendent() {
        return superintendent;
    }

    public void setSuperintendent(String superintendent) {
        this.superintendent = superintendent;
    }

    public boolean isPhotoViewed() {
        return Boolean.TRUE.equals(photoViewed);
    }

    public void setPhotoViewed(boolean photoViewed) {
        this.photoViewed = photoViewed;
    }

    public String getComplaintType() {
        return complaintType;
    }

    public void setComplaintType(String complaintType) {
        this.complaintType = complaintType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}