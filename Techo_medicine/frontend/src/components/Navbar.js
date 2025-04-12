import React from "react";
import { Navbar as BootstrapNavbar, Nav, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
     
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-heart-pulse text-info me-2" style={{ fontSize: "1.5rem" }}></i> {/* Bootstrap Icon */}
          <span className="fw-bold text-info" style={{ fontSize: "1.7rem" }}>TechoMedicine</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {token ? (
              <>
              <Nav.Link as={Link} to="/" className="text-light fs-6">Home</Nav.Link>
                <Nav.Link as={Link} to="/dashboard" className="text-light">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/appointment" className="text-light">Appointment</Nav.Link>
                <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-light" onClick={() => navigate("/login")} className="me-2">
                  Login
                </Button>
                <Button variant="outline-success" onClick={() => navigate("/register")}>
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default AppNavbar;
