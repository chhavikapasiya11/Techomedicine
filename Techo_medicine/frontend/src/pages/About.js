import React, { useState } from "react";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  FaStethoscope, FaUserMd, FaCalendarAlt, FaMicrophone, 
  FaRobot, FaShieldAlt, FaPhone, FaMapMarkerAlt, FaEnvelope, FaQuestionCircle 
} from "react-icons/fa";

const About = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Container className="mt-5">
     <h2 className="text-center mb-4 fw-bold" style={{ fontSize: "2.5rem", color: "#007bff" }}>
  Welcome to <span style={{ background: "linear-gradient(45deg, #007bff, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
    TechoMedicine
  </span>
</h2>

      {/* Features Section */}
      <h3 className="text-center mt-5">💡 Our Features</h3>

      <Row className="g-4 mt-3">
        {[
          { icon: <FaStethoscope size={40} />, title: "Online Consultations", text: "Connect with doctors via video calls anytime, anywhere." },
          { icon: <FaShieldAlt size={40} />, title: "Secure Medical Records", text: "Store and access your medical history securely in one place." },
          { icon: <FaCalendarAlt size={40} />, title: "Easy Appointment Booking", text: "Schedule consultations with doctors at your convenience." },
          { icon: <FaRobot size={40} />, title: "AI Query Assistance", text: "Get instant answers to your medical queries using AI." },
          { icon: <FaMicrophone size={40} />, title: "Voice Search", text: "Easily search for doctors and health records using voice commands." }
        ].map((feature, index) => (
          <Col md={4} key={index}>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <Card className="p-3 shadow text-center">
                <Card.Body>
                  <div className="mb-3 text-primary">{feature.icon}</div>
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.text}</Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* How It Works Section */}
      <h3 className="text-center mt-5">⚙️ How It Works</h3>

      <Row className="g-4 mt-3">
        {[
          "Sign up and create your profile.",
          "Browse and choose a doctor for consultation.",
          "Book an appointment at your convenience.",
          "Join a secure video call with the doctor.",
          "Access and store your prescriptions and records."
        ].map((step, index) => (
          <Col md={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Card className="p-3 shadow text-center">
                <Card.Body>
                  <Card.Title>Step {index + 1}</Card.Title>
                  <Card.Text>{step}</Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* FAQs Section */}
      <h3 className="text-center mt-5">❓ Frequently Asked Questions</h3>
      <Accordion className="mt-3">
        {[
          { question: "How do I book an appointment?", answer: "You can book an appointment by signing up, selecting a doctor, and choosing a suitable time slot." },
          { question: "Are my medical records secure?", answer: "Yes, we use end-to-end encryption to store and protect your medical records securely." },
          { question: "Can I consult a specialist?", answer: "Yes, we have a range of specialists available for consultation." },
          { question: "How does AI Query Assistance work?", answer: "Our AI can answer basic medical questions and guide you to the right specialist." },
          { question: "Is TechoMedicine available 24/7?", answer: "Yes, we have doctors available at all hours to provide assistance." }
        ].map((faq, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header onClick={() => toggleFAQ(index)}>
                <FaQuestionCircle className="me-2 text-primary" /> {faq.question}
              </Accordion.Header>
              <Accordion.Body className={openIndex === index ? "show" : "collapse"}>
                {faq.answer}
              </Accordion.Body>
            </Accordion.Item>
          </motion.div>
        ))}
      </Accordion>

      {/* Testimonials Section */}
      <h3 className="text-center mt-5">💬 What Our Users Say</h3>
      <Row className="g-4 mt-3">
        {[
          { text: "TechoMedicine made healthcare more accessible. It's amazing!", user: "Alex Johnson" },
          { text: "The ability to store and share my medical records securely is a game-changer!", user: "Rohan Mehra" },
          { text: "Booking an appointment has never been easier. Highly recommend TechoMedicine!", user: "Shruti Singh" }
        ].map((testimonial, index) => (
          <Col md={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Card className="p-3 shadow">
                <Card.Body>
                  <Card.Text>"{testimonial.text}"</Card.Text>
                  <Card.Footer className="text-muted">- {testimonial.user}</Card.Footer>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Contact Us Section */}
      <h3 className="text-center mt-5">📞 Contact Us</h3>
      <Card className="p-3 mt-3 shadow">
        <Card.Body>
          <Card.Text><FaPhone className="text-primary" /> 📞 +1 800-123-4567</Card.Text>
          <Card.Text><FaEnvelope className="text-primary" /> ✉️ support@techomedicine.com</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default About;
