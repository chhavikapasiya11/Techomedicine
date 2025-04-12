import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Form, Button, Container, Alert, Spinner, Card, ListGroup } from "react-bootstrap";

const PatientDetails = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    medicalHistory: "",
    contactNumber: "",
    presentHealthStatus:""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.userId) {
          setUserId(parsedUser.userId);
        } else {
          setError("Invalid user data. Please log in again.");
        }
      } catch (error) {
        setError("Error retrieving user data. Please log in again.");
      }
    } else {
      setError("User data missing. Please log in again.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === "application/pdf");

    if (pdfFiles.length === 0) {
      setError("Only PDF files are allowed.");
      return;
    }

    setUploadedFiles([...uploadedFiles, ...pdfFiles]);
    setError(""); 
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("User ID is missing. Cannot submit data.");
      return;
    }

    const requestData = {
      userId,
      age: formData.age,
      gender: formData.gender,
      medicalHistory: formData.medicalHistory
        ? formData.medicalHistory.split(",").map((item) => item.trim())
        : [],
      presentHealthStatus: formData.presentHealthStatus
        ? formData.presentHealthStatus.split(",").map((item) => item.trim())
        : [],

      contactNumber: formData.contactNumber,
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:7000/api/auth/patient", requestData);
      
      setSuccess("Details added successfully!");
    
      setTimeout(() => {
        setSuccess("Details saved successfully (Files stored locally)!");
        setLoading(false);
        setFormData({ age: "", gender: "", medicalHistory: "",presentHealthStatus:"", contactNumber: "" });
        setUploadedFiles([]); 
        navigate("/"); 
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="shadow-lg p-4 rounded" style={{ width: "100%", maxWidth: "600px" }}>
        <Card.Body>
          <h2 className="text-center text-dark mb-4">Enter Your Details</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Medical History</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Comma-separated values (e.g., Diabetes, Hypertension)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Present Health Status</Form.Label>
  <Form.Control
    as="textarea"
    rows={3}
    name="presentHealthStatus"
    value={formData.presentHealthStatus}
    onChange={handleChange}
  />
</Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
            </Form.Group>

            {/* File Upload Field */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Medical Reports (PDF only)</Form.Label>
              <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} multiple />
              <small className="text-muted">Upload multiple PDF reports.</small>
            </Form.Group>

            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <ListGroup className="mb-3">
                {uploadedFiles.map((file, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    {file.name}
                    <Button variant="danger" size="sm" onClick={() => handleRemoveFile(index)}>Remove</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PatientDetails;
