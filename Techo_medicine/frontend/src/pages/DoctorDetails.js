import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert, Card, Spinner } from "react-bootstrap";

const DoctorDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    availableSlots: "",
    bio: "",
  });

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("User data missing. Please log in again.");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.userId || !parsedUser.email) {
        throw new Error("Invalid user data. Please log in again.");
      }
      setUserData(parsedUser);
    } catch (err) {
      setError("Error retrieving user data. Please log in again.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!userData) {
      setError("User data missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        userId: userData.userId,
        email: userData.email,
        specialization: formData.specialization,
        experience: Number(formData.experience),
        availableSlots: formData.availableSlots.split(",").map((slot) => slot.trim()),
        bio: formData.bio,
      };

      await axios.post("http://localhost:7000/api/auth/signup/doctor", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess("Details added successfully! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body>
          <h2 className="mb-3 text-center">Enter Doctor Details</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control type="text" name="specialization" value={formData.specialization} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience (years)</Form.Label>
              <Form.Control type="number" name="experience" value={formData.experience} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Available Slots (comma-separated dates)</Form.Label>
              <Form.Control type="text" name="availableSlots" value={formData.availableSlots} onChange={handleChange} placeholder="YYYY-MM-DD, YYYY-MM-DD" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" name="bio" value={formData.bio} onChange={handleChange} rows={3} />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DoctorDetails;
