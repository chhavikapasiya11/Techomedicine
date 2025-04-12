import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Form, Alert, Spinner, Modal, Card } from "react-bootstrap";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ doctorId: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [symptoms, setSymptoms] = useState([]); 
  const [matchedDoctors, setMatchedDoctors] = useState([]); 
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [upiPasskey, setUpiPasskey] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (appointments.length > 0 && doctors.length > 0) {
      checkNotifications();
    }
  }, [appointments, doctors]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchDoctors(), fetchAppointments()]);
    } catch (err) {
      showAlert("error", "Failed to load data.");
    }
  };

  const showAlert = (type, message) => {
    type === "success" ? setSuccess(message) : setError(message);
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get("http://localhost:7000/api/auth/doctors");
      setDoctors(data);
    } catch (err) {
      showAlert("error", "Failed to fetch doctors.");
    }
  };

  const fetchAppointments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.userId) {
        navigate("/login");
        return;
      }

      const { data } = await axios.get(`http://localhost:7000/api/auth/patientappointments/${user.userId}`);
      const updatedAppointments = data.map(app => ({ ...app, disabled: false }));
      setAppointments(updatedAppointments);
    } catch (err) {
      showAlert("error", "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const checkNotifications = () => {
    const newNotifications = appointments
      .filter(app => app.status === "Confirmed" || app.status === "Cancelled")
      .map(app => {
        const doctor = doctors.find(d => d.userId === app.doctorId);
        return `Your appointment with  ${doctor ? doctor.name : "Unknown"} is ${app.status}`;
      });

    setNotifications(newNotifications);
  };

  const handleSymptomChange = (e) => {
    const { value } = e.target;
    setSymptoms(value.split(",").map(symptom => symptom.trim()));
  };

  const handleMatchDoctors = async () => {
    try {
      const response = await axios.post("http://localhost:7000/api/matchDoctor/match-doctor", { presentHealthStatus: symptoms });
      setMatchedDoctors(response.data.matches);
      showAlert("success", "Doctors matched successfully!");
    } catch (err) {
      showAlert("error", "Failed to match doctors.");
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.userId) {
        showAlert("error", "User not found. Please log in again.");
        navigate("/login");
        return;
      }

      await axios.post("http://localhost:7000/api/auth/appointment", {
        patientId: user.userId,
        doctorId: newAppointment.doctorId,
        date: newAppointment.date,
      });

      showAlert("success", "Appointment booked successfully!");
      setNewAppointment({ doctorId: "", date: "" });
      fetchAppointments(); 
    } catch (err) {
      showAlert("error", "Failed to book appointment.");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.userId) {
        showAlert("error", "User not found. Please log in again.");
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:7000/api/auth/cancel-appointment/${appointmentId}`, {
        data: { patientId: user.userId }
      });

      setAppointments(appointments.filter((app) => app._id !== appointmentId));
      showAlert("success", "Appointment cancelled successfully!");
    } catch (err) {
      showAlert("error", "Failed to cancel appointment.");
    }
  };

  const handlePaymentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((app) =>
        app._id === selectedAppointment._id ? { ...app, paid: true, disabled: true } : app
      );

      setAppointments(updatedAppointments);
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    }
    setShowPaymentModal(false);
  };

  const handleJoinMeeting = async (appointmentId) => {
    try {
      const { data } = await axios.get(`http://localhost:7000/api/getmeet/appointment/${appointmentId}/meeting-link`);
      if (data.meetingLink) {
        window.open(data.meetingLink, "_blank");
      } else {
        showAlert("error", "Meeting not started yet by doctor.");
      }
    } catch (err) {
      showAlert("error", "Failed to fetch meeting link.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Manage My Appointments</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <h3>🔔 Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((note, index) => <Alert key={index} variant="info">{note}</Alert>)
      ) : (
        <p>No notifications yet.</p>
      )}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Enter Your Symptoms (comma separated)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. fever, cold, cough"
            onChange={handleSymptomChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleMatchDoctors}>
          Find Doctors
        </Button>
      </Form>

      {matchedDoctors.length > 0 && (
        <div>
          <h3 className="mt-4">Matched Doctors</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {matchedDoctors.map((doctor, index) => (
                <tr key={doctor._id}>
                  <td>{index + 1}</td>
                  <td>{doctor.userId?.username || "Unknown"}</td>
                  <td>{doctor.specialization || "N/A"}</td>
                  <td>{doctor.experience ? `${doctor.experience} years` : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Form onSubmit={handleBookAppointment} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Select Doctor</Form.Label>
          <Form.Select
            name="doctorId"
            value={newAppointment.doctorId}
            onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.userId} value={doctor.userId}>
                {doctor.name} - {doctor.specialization} ({doctor.experience} years)
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date & Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="date"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Book Appointment
        </Button>
      </Form>

      <h3 className="mt-4">Existing Appointments</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Doctor</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => {
              const doctorInfo = doctors.find((d) => d.userId === appointment.doctorId) || {};
              const statusBg = appointment.status === "Confirmed" ? "bg-success text-white" : 
                              appointment.status === "Cancelled" ? "bg-danger text-white" : "bg-warning text-dark";

              return (
                <tr key={appointment._id}>
                  <td>{index + 1}</td>
                  <td>{doctorInfo.name || "Unknown"}</td>
                  <td>{doctorInfo.specialization || "N/A"}</td>
                  <td>{doctorInfo.experience ? `${doctorInfo.experience} years` : "N/A"}</td>
                  <td>{new Date(appointment.date).toLocaleString()}</td>
                  <td className={statusBg}>{appointment.status}</td>
                  <td>
                    {appointment.status === "Confirmed" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handlePaymentClick(appointment)}
                          disabled={appointment.paid || appointment.disabled}
                          className="me-2"
                        >
                          {appointment.paid ? "Paid" : "Proceed to Payment"}
                        </Button>

                        {appointment.paid && (
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleJoinMeeting(appointment._id)}
                            className="me-2"
                          >
                            Join Online Appointment
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        const reason = window.prompt("Enter cancellation reason:");
                        if (reason) handleCancelAppointment(appointment._id, reason);
                      }}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <Card className="shadow-sm p-3">
              <Card.Body>
                <h4 className="mb-3">Payment Summary</h4>
                <p><strong>Appointment Date:</strong> {new Date(selectedAppointment.date).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> Rs.1100</p>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>UPI ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>UPI Passkey</Form.Label>
                    <Form.Control
                      type="password"
                      value={upiPasskey}
                      onChange={(e) => setUpiPasskey(e.target.value)}
                      placeholder="Enter 6-digit passkey"
                      maxLength={6}
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmPayment} disabled={!upiId || upiPasskey.length !== 6}>
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Appointments;
