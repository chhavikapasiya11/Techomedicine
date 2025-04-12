import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Alert, Spinner } from "react-bootstrap";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Show Alert for 2 seconds
  const showAlert = (type, message) => {
    if (type === "success") setSuccess(message);
    else setError(message);

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 2000);
  };

  // Fetch Doctor's Appointments
  const fetchAppointments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.userId) {
        showAlert("error", "Doctor not found. Please log in again.");
        return;
      }

      const response = await axios.get(`http://localhost:7000/api/auth/appointments?doctorId=${user.userId}`);
      setAppointments(response.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      showAlert("error", "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  // Update Appointment Status
  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await axios.put("http://localhost:7000/api/auth/statusupdate", {
        appointmentId,
        status,
      });

      if (response.status === 200) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app._id === appointmentId ? { ...app, status } : app
          )
        );

        showAlert("success", `Appointment ${status.toLowerCase()} successfully!`);
      } else {
        throw new Error("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating appointment status:", err.response?.data || err.message);
      showAlert("error", err.response?.data?.message || "Failed to update appointment status.");
    }
  };

  const startMeeting = async (appointmentId) => {
    try {
      const response = await axios.put('http://localhost:7000/api/meeting/start-meeting', {
        appointmentId,
      });
  
      const { meetingLink } = response.data;
  
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === appointmentId ? { ...app, meetingLink } : app
        )
      );
    } catch (error) {
      console.error('Error starting meeting:', error);
      showAlert("error", "Failed to start meeting.");
    }
  };
  return (
    <Container className="mt-4">
      <h2 className="text-center">My Appointments</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <tr key={appointment._id}>
                <td>{index + 1}</td>
                <td>{appointment.patientId?.name || "Unknown"}</td>
                <td>{new Date(appointment.date).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      appointment.status === "Confirmed"
                        ? "bg-success"
                        : appointment.status === "Cancelled"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td>
                  {appointment.status === "Pending" && (
                    <>
                      <Button variant="success" size="sm" onClick={() => updateAppointmentStatus(appointment._id, "Confirmed")}>
                        Accept
                      </Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => updateAppointmentStatus(appointment._id, "Cancelled")}>
                        Cancel
                      </Button>
                    </>
                  )}

                  {appointment.status === "Confirmed" && (
                      <>
                      {appointment.meetingLink ? (
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Join Meeting
                        </a>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => startMeeting(appointment._id)}
                        >
                          Start Online Appointment
                        </Button>
                      )}
                    </>

                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default DoctorAppointments;
