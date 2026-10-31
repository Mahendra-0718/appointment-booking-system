package com.appointment.dto;

import jakarta.validation.constraints.NotBlank;

public class AppointmentRequest {

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Date is required")
    private String appointmentDate;

    @NotBlank(message = "Time slot is required")
    private String timeSlot;

    private String status;

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}