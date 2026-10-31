package com.appointment.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appointment.dto.AppointmentRequest;
import com.appointment.model.Appointment;
import com.appointment.repository.AppointmentRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    public AppointmentController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        if (appointmentRepository.existsByAppointmentDateAndTimeSlot(request.getAppointmentDate(), request.getTimeSlot())) {
            return ResponseEntity.badRequest().body("This time slot on the selected date is already booked!");
        }

        Appointment appointment = new Appointment(
            request.getStudentName(),
            request.getAppointmentDate(),
            request.getTimeSlot()
        );
        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentRequest request) {
        Optional<Appointment> existingOpt = appointmentRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Appointment> duplicateCheck = appointmentRepository.findByAppointmentDateAndTimeSlot(
            request.getAppointmentDate(), request.getTimeSlot()
        );

        if (duplicateCheck.isPresent() && !duplicateCheck.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body("The new time slot on this date is already booked!");
        }

        Appointment appointment = existingOpt.get();
        appointment.setStudentName(request.getStudentName());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setTimeSlot(request.getTimeSlot());
        if (request.getStatus() != null) {
            appointment.setStatus(request.getStatus());
        }

        Appointment updated = appointmentRepository.save(appointment);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        if (!appointmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}