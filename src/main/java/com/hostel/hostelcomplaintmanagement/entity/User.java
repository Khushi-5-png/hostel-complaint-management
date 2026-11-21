package com.hostel.hostelcomplaintmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(name = "college_registration_id", nullable = false, unique = true)
  private String collegeRegistrationId;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private String role;

  // ----- Existing OTP fields (used elsewhere) -----
  @Column(name = "reset_otp")
  private String resetOtp;

  @Column(name = "reset_otp_expiry")
  private LocalDateTime resetOtpExpiry;

  // ----- NEW reset‑token fields required by PasswordResetService -----
  @Column(name = "reset_token")
  private String resetToken;

  @Column(name = "reset_token_expiry")
  private LocalDateTime resetTokenExpiry;

  // ------------------- Constructors -------------------
  public User() {
  }

  // ------------------- Getters -------------------
  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getCollegeRegistrationId() {
    return collegeRegistrationId;
  }

  public String getEmail() {
    return email;
  }

  public String getPassword() {
    return password;
  }

  public String getRole() {
    return role;
  }

  public String getResetOtp() {
    return resetOtp;
  }

  public LocalDateTime getResetOtpExpiry() {
    return resetOtpExpiry;
  }

  // **New getters**
  public String getResetToken() {
    return resetToken;
  }

  public LocalDateTime getResetTokenExpiry() {
    return resetTokenExpiry;
  }

  // ------------------- Setters -------------------
  public void setId(Long id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setCollegeRegistrationId(String collegeRegistrationId) {
    this.collegeRegistrationId = collegeRegistrationId;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public void setResetOtp(String resetOtp) {
    this.resetOtp = resetOtp;
  }

  public void setResetOtpExpiry(LocalDateTime resetOtpExpiry) {
    this.resetOtpExpiry = resetOtpExpiry;
  }

  // **New setters**
  public void setResetToken(String resetToken) {
    this.resetToken = resetToken;
  }

  public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
    this.resetTokenExpiry = resetTokenExpiry;
  }
}
