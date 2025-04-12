import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner, Card } from "react-bootstrap";

const AIQuery = () => {
    const [query, setQuery] = useState("");   
    const [response, setResponse] = useState("");  
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    // Send Query to Backend
    const sendQuery = async () => {
        if (!query.trim()) {
            setError("Query cannot be empty.");
            return;
        }

        setError(""); 
        setResponse("Processing...");
        setLoading(true);

        try {
            const cleanedQuery = query.replace(/[^\w\s]/gi, ""); // Remove punctuation
            console.log("Final Query Sent:", cleanedQuery);

            const res = await axios.post("http://localhost:7000/api/gemini/analyze", { query: cleanedQuery });
            console.log("Server Response:", res.data);
            setResponse(res.data.response || "No response received.");
        } catch (error) {
            console.error("API Error:", error);
            setError("Error processing request. Please try again.");
            setResponse("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container 
            fluid
            className="d-flex flex-column align-items-center justify-content-center mt-5"
            style={{
                minHeight: "80vh",
                background: "#f8f9fa", 
                padding: "30px"
            }}
        >
            <Card className="p-4 shadow-sm w-100" style={{ borderRadius: "10px" }}>
                <h2 className="text-center mb-4" style={{ color: "#333", fontWeight: "500" }}>
                    AI Health Assistant
                </h2>

                {/* Text Query Section */}
                <Form>
                    <Form.Group>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter your query..." 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                            style={{
                                borderRadius: "8px",
                                padding: "10px",
                                fontSize: "16px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </Form.Group>
                    <Button 
                        variant="dark" 
                        className="mt-3 w-100"
                        onClick={sendQuery} 
                        disabled={!query.trim() || loading}
                        style={{
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "500"
                        }}
                    >
                        {loading ? "Processing..." : "Ask AI"}
                    </Button>
                </Form>

                {/* Loading Indicator */}
                {loading && (
                    <div className="text-center mt-3">
                        <Spinner animation="border" variant="dark" />
                    </div>
                )}

                {/* AI Response */}
                {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
                {response && (
                    <Alert variant="secondary" className="mt-3 p-3" 
                        style={{
                            borderRadius: "8px",
                            background: "#f1f1f1",
                            color: "#333",
                            fontSize: "15px"
                        }}>
                        {response}
                    </Alert>
                )}
            </Card>
        </Container>
    );
};

export default AIQuery;
