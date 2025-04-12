import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";  
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Card, Spinner, Container, Alert, Image, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // Get user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.userId || !storedUser?.role) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const { userId, role } = storedUser; // Fetch by `userId`
    const apiUrl = `http://localhost:7000/api/auth/${role}/${userId}`;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log("📌 API Response:", response.data);
        
        if (!response.data) {
          setError("Invalid response from server.");
          return;
        }

        // Ensure the response has a `name` before updating state
        if (!response.data.name) {
          console.warn("⚠️ Name is missing from API response");
        }

        setUser(response.data);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  // Default images for roles
  const profileImages = {
    doctor: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    patient: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg">
        <Card.Body>
          {/* Centered Heading */}
          <h1 className="text-center mb-4">Dashboard</h1>

          <Row className="align-items-center">
            {/* User Details on Left */}
            <Col md={9}>
              <p><strong>Name:</strong> {user.name || "N/A"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>

              {/* Show Doctor-specific details */}
              {user.role === "doctor" && (
                <>
                  <p><strong>Specialization:</strong> {user.specialization || "Not Provided"}</p>
                  <p><strong>Experience:</strong> {user.experience ? `${user.experience} years` : "Not Provided"}</p>
                  <p><strong>Bio:</strong> {user.bio || "Not Provided"}</p>
                </>
              )}

              {/* Show Patient-specific details */}
              {user.role === "patient" && (
                <>
                  <p><strong>Age:</strong> {user.age || "Not Provided"}</p>
                  <p><strong>Medical History:</strong> {user.medicalHistory?.join(", ") || "Not Available"}</p>
                  <div className="mt-4 p-4  text-center shadow-lg" 
     style={{
       background: "linear-gradient(135deg, #007bff,rgb(16, 242, 95))", 
       borderRadius: "15px", 
       color: "white",
       marginRight: "25px"
     }}>
  <h4 className="mb-3 fw-bold">🤖 AI Assistant</h4>
  
  <div className="d-flex justify-content-center gap-3">
    <Button 
      variant="light" 
      className="fw-semibold px-4 py-2"
      style={{ color: "#007bff", borderRadius: "10px" }}
      onClick={() => navigate("/ai-query")}
    >
      📝 Text Query
    </Button>

    <Button 
      variant="outline-light" 
      className="fw-semibold px-4 py-2"
      style={{ borderWidth: "2px", borderRadius: "10px", color: "white" }}
      onClick={() => navigate("/voice-search")}
    >
      🎤 Voice Query
    </Button>
  </div>
</div>


                </>
              )}
            </Col>

            {/* Profile Image on Right (Larger Size) */}
            <Col md={3} className="text-center">
              <Image 
                src={profileImages[user.role] || profileImages.patient} 
                roundedCircle 
                fluid 
                style={{ width: "180px", height: "180px" }} 
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
