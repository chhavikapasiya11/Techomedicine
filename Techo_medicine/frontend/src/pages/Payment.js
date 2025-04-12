import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Alert, Card, Modal } from "react-bootstrap";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;
  const [paid, setPaid] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!appointment) {
      navigate("/appointments");
    }
  }, [appointment, navigate]);

  const handlePayment = () => {
    setShowModal(false);
    setPaid(true);
    setMessage("Payment successful!");

    // Update payment status locally
    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const updatedAppointments = storedAppointments.map((appt) =>
      appt._id === appointment._id ? { ...appt, paid: true } : appt
    );

    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    setTimeout(() => {
      navigate("/appointment");
    }, 2000);
  };

  return (
    <Container className="mt-5 text-center">
      <h2 className="mb-4">Appointment Payment</h2>
      {message && <Alert variant="success">{message}</Alert>}

      {!paid ? (
        <Card className="shadow-lg p-4 mb-4">
          <Card.Body>
            <h4 className="mb-3">Payment Summary</h4>
            <p><strong>Appointment Date:</strong> {new Date(appointment?.date).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> Rs.1100</p>

            <Button variant="success" size="lg" onClick={() => setShowModal(true)}>
              Proceed to Payment
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="success" className="mt-4">Payment Completed! Redirecting...</Alert>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to proceed with the payment of <strong>Rs.1100</strong> for your appointment?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handlePayment}>
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Payment;
