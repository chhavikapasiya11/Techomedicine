import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Col, Card, Button, Form, Alert } from "react-bootstrap";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:7000/api/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("🟢 Login Response:", response.data);

      if (!response.data.token || !response.data.userId || !response.data.role) {
        throw new Error("Login failed: Missing token, userId, or role.");
      }

      // Store user details & token in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ userId: response.data.userId, role: response.data.role, email: response.data.email })
      );
      localStorage.setItem("token", response.data.token);
      console.log(" User saved in localStorage:", localStorage.getItem("user"));

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/"); 
      }, 2000);
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Col md={6} className="mx-auto">
        <Card className="p-4 shadow">
          <h2 className="text-center">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Login
            </Button>
          </Form>

          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <Button variant="link" onClick={() => navigate("/signup")}>Sign Up</Button>
          </p>
        </Card>
      </Col>
    </Container>
  );
};

export default LoginPage;
