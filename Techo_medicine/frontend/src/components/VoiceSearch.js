import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Alert, Spinner, Card } from "react-bootstrap";

const VoiceSearch = () => {
    const [query, setQuery] = useState("");   // Stores speech-to-text result
    const [response, setResponse] = useState("");  // Stores AI response
    const [isListening, setIsListening] = useState(false);  // Speech state
    const [error, setError] = useState(""); // Error messages

    // Start Speech Recognition
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            console.log("Captured Speech:", transcript); 
            setQuery(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            setError("Speech recognition failed. Please try again.");
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    };

    //  Send Query to Backend
    const sendQuery = async () => {
        if (!query.trim()) {
            setError("Query cannot be empty.");
            return;
        }

        setError(""); 
        setResponse("Processing...");

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
                    Voice Search with AI
                </h2>

                {/* Start Listening Button */}
                <Button 
                    variant={isListening ? "secondary" : "dark"} 
                    className="w-100 mb-3"
                    onClick={startListening}
                    disabled={isListening}
                    style={{
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "500"
                    }}
                >
                    {isListening ? "Listening..." : "Start Voice Search"}
                </Button>

                {/* Display Query */}
                <p className="text-center" style={{ fontSize: "16px", color: "#333" }}>
                    <strong>Query:</strong> {query || "No query yet"}
                </p>

                {/* Send Query Button */}
                <Button 
                    variant="dark" 
                    className="w-100 mb-3"
                    onClick={sendQuery}
                    disabled={!query.trim()}
                    style={{
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "500"
                    }}
                >
                    Send Query
                </Button>

                {/* Loading Indicator */}
                {isListening && (
                    <div className="text-center mt-2">
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

export default VoiceSearch;
