import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar"; 
import VoiceSearch from "./components/VoiceSearch";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About"
import DoctorDetails from "./pages/DoctorDetails";
import PatientDetails from "./pages/PatientDetails";
import Appointment from "./pages/Appointment";
import Patientappointment from "./pages/Patientappointment";
import Doctorappointment from "./pages/Doctorappointment";
import Payment from "./pages/Payment";

import AiQuery from "./pages/AiQuery";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Keep only one instance of Navbar */}
        <div className="container mt-4">
           {/*<h1 className="text-center">AI-Powered Telemedicine Voice Search</h1>
          <VoiceSearch />*/}
          <Routes>
            <Route path="/" element={<Navigate to="/about" />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctor-details" element={<DoctorDetails />} />
        <Route path="/patient-details" element={<PatientDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-query" element={<AiQuery />} />
            <Route path="/voice-search" element={<VoiceSearch />} />
            <Route path="/patient-appointments" element={<Patientappointment />} />
            <Route path="/doctor-appointments" element={<Doctorappointment />} />
            <Route path="/voice-search" element={<VoiceSearch />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/payment" element={<Payment/>} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
