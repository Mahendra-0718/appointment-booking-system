package com.appointment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appointment.model.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByAppointmentDateAndTimeSlot(String appointmentDate, String timeSlot);
    Optional<Appointment> findByAppointmentDateAndTimeSlot(String appointmentDate, String timeSlot);
}