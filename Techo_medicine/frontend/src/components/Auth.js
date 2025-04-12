import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import axios from "../utils/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", name: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const { data } = await axios.post(endpoint, formData);
      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4" style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-3">{isLogin ? "Login" : "Register"}</h2>
          <ToggleButtonGroup type="radio" name="authMode" className="d-flex mb-3">
            <ToggleButton variant="outline-primary" onClick={() => setIsLogin(true)} active={isLogin}>Login</ToggleButton>
            <ToggleButton variant="outline-success" onClick={() => setIsLogin(false)} active={!isLogin}>Register</ToggleButton>
          </ToggleButtonGroup>

          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              {isLogin ? "Login" : "Register"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Auth;
