import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPhone || !formData.password || !formData.role) {
      setError("All fields are required!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }
    if (formData.phone.length < 10) {
      setError("phone number must be at least 10 digits long!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:7000/api/auth/signup", {
        username: trimmedUsername,
        email: trimmedEmail,
        password: formData.password,
        phone: trimmedPhone,
        role: formData.role,
      });

      if (!response.data.token || !response.data.userId || !response.data.role) {
        throw new Error("Signup failed: Missing token, userId, or role.");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.data.userId,
          role: response.data.role,
          email: response.data.email,
        })
      );
      localStorage.setItem("token", response.data.token);

      setSuccess("Signup successful! Redirecting...");

      setTimeout(() => {
        const redirectPath =
          response.data.role === "doctor"
            ? "/doctor-details"
            : response.data.role === "patient"
            ? "/patient-details"
            : "/";

        navigate(redirectPath);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="shadow-lg p-4 rounded" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
        <h2 className="text-center text-dark mb-4">Create an Account</h2>


          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter your username" name="username" value={formData.username} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" placeholder="Enter your phone number" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter a password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm your password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Role</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Choose...</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
