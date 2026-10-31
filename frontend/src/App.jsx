import React, { useState, useEffect } from 'react';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    studentName: '',
    appointmentDate: '',
    timeSlot: '09:00 AM - 10:00 AM',
    status: 'Scheduled'
  });

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/appointments');
      if (res.ok) {
        setAppointments(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.studentName.trim() || !form.appointmentDate) {
      setError('Student name and appointment date are required.');
      return;
    }

    if (editingId) {
      try {
        const res = await fetch(`http://localhost:8080/api/appointments/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        if (res.ok) {
          setSuccess('Appointment updated successfully!');
          setEditingId(null);
          setForm({ studentName: '', appointmentDate: '', timeSlot: '09:00 AM - 10:00 AM', status: 'Scheduled' });
          fetchAppointments();
        } else {
          const msg = await res.text();
          setError(msg || 'Failed to update appointment.');
        }
      } catch (err) {
        setError('Could not connect to server.');
      }
    } else {
      try {
        const res = await fetch('http://localhost:8080/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        if (res.ok) {
          setSuccess('Appointment booked successfully!');
          setForm({ studentName: '', appointmentDate: '', timeSlot: '09:00 AM - 10:00 AM', status: 'Scheduled' });
          fetchAppointments();
        } else {
          const msg = await res.text();
          setError(msg || 'Failed to book appointment.');
        }
      } catch (err) {
        setError('Could not connect to server.');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      studentName: item.studentName,
      appointmentDate: item.appointmentDate,
      timeSlot: item.timeSlot,
      status: item.status
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ studentName: '', appointmentDate: '', timeSlot: '09:00 AM - 10:00 AM', status: 'Scheduled' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/appointments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccess('Appointment cancelled/deleted.');
        fetchAppointments();
      }
    } catch (err) {
      console.error('Failed to delete appointment', err);
    }
  };

  return (
    <div className="container">
      <h1>Appointment Booking System</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="card">
        <h2>{editingId ? 'Edit Appointment' : 'Book New Appointment'}</h2>
        
        <div className="form-group">
          <label>Student Name:</label>
          <input
            type="text"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="e.g. Alex Johnson"
            required
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Time Slot:</label>
            <select name="timeSlot" value={form.timeSlot} onChange={handleChange}>
              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
            </select>
          </div>
        </div>

        {editingId && (
          <div className="form-group">
            <label>Status:</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}

        <div className="btn-group">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Appointment' : 'Book Appointment'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <h2>Booked Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.studentName}</strong></td>
                  <td>{item.appointmentDate}</td>
                  <td><span className="badge">{item.timeSlot}</span></td>
                  <td>
                    <span className={`status-tag status-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-sm btn-warning" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;