package com.hostel.hostelcomplaintmanagement.repository;

import com.hostel.hostelcomplaintmanagement.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
}