import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); 

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
      return;
    }

    if (user.role === "doctor") {
      navigate("/doctor-appointments"); // Redirect to doctor appointments page
    } else {
      navigate("/patient-appointments"); // Redirect to patient appointments page
    }
  }, [navigate, user]);

  return <div>Redirecting...</div>;
};

export default Appointment;
