const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Patient = require("../../models/Patient");
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");
const HealthRecord = require("../../models/MedicalRecord");
//const sendEmail = require("../../utils/sendEmail");

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;



const generateToken = (userId, expiresIn = "45d") => jwt.sign({ userId }, JWT_SECRET, { expiresIn });

/*
 USER AUTHENTICATION  */

// User Signup (Generalized)
router.post(
  "/signup",
  [
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").isMobilePhone().withMessage("Invalid phone number"),
    body("role").isIn(["patient", "doctor"]).withMessage("Invalid role"),
  ],
  async (req, res) => {
    console.log("🟢 Incoming Signup Request:", req.body); //  Log full request body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation Errors:", errors.array()); //  Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).json({ error: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        role: req.body.role, 
        createdAt: Date.now(),
      });
      await user.save();

      const token = generateToken(user.id, "30d");

      console.log("🟢 Signup Successful:", { token, userId: user._id, role: user.role, email: user.email }); 

      res.json({ token, userId: user._id, role: user.role, email: user.email });
    } catch (error) {
      console.error("❌ Server Error:", error.message);
      res.status(500).send("Server Error");
    }
  }
);

// ➤ Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").exists().withMessage("Password required"),
  ],
  async (req, res) => {
    console.log(" Incoming Login Request:", req.body); // Log full request body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(" Validation Errors:", errors.array()); // Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(400).json({ error: "Invalid credentials" });
      
      const token = generateToken(user.id, "30d");
      console.log("🟢 Login Successful:", { token, userId: user._id, role: user.role, email: user.email });

      res.json({ token, userId: user._id, role: user.role, email: user.email });
    } catch (error) {
      console.error("❌ Server Error:", error.message);
      res.status(500).send("Server Error");
    }
  }
);
// password correction
// router.post(
//   "/forgot-password",
//   [body("email").isEmail().withMessage("Invalid email")],
//   async (req, res) => {
//     const { email } = req.body;
//     try {
//       const user = await User.findOne({ email });
//       if (!user) return res.status(404).json({ error: "User not found" });

//       const token = generateToken(user.id, "1h");
//       const resetLink = `http://localhost:3000/reset-password?token=${token}`;

//       // Send reset link via email
//       await sendEmail(user.email, "Password Reset", `Click the link to reset your password: ${resetLink}`);

//       res.json({ message: "Reset link sent to your email" });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );
// // reset password
// router.post(
//   "/reset-password",
//   [
//     body("token").notEmpty().withMessage("Token is required"),
//     body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
//   ],
//   async (req, res) => {
//     const { token, newPassword } = req.body;
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id);
//       if (!user) return res.status(404).json({ error: "User not found" });

//       user.password = await bcrypt.hash(newPassword, 10);
//       await user.save();

//       res.json({ message: "Password reset successfully" });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Invalid or expired token");
//     }
//   }
// );


/*
  PATIENT ROUTES
   */

  router.post("/patient", async (req, res) => {
    try {
      const { userId, age, gender, medicalHistory, contactNumber,presentHealthStatus } = req.body;
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user || user.role !== "patient") {
        return res.status(404).json({ error: "Patient user not found" });
      }
  
      // Create a new patient record
      const newPatient = new Patient({
        userId,
        age,
        gender,
        medicalHistory,
        presentHealthStatus,
        contactNumber
      });
  
      await newPatient.save();
  
      res.status(201).json({ message: "Patient details added successfully", patient: newPatient });
    } catch (error) {
      console.error("Error in /patient route:", error); 
      res.status(500).json({ error: error.message || "Server Error" });
    }
  });
  
// route to get patient details

router.get("/patient/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch User Data
    const user = await User.findById(userId);
    if (!user || user.role !== "patient") {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Fetch Patient Data
    const patient = await Patient.findOne({ userId: userId });

    if (!patient) {
      return res.json({
        name: user.username,
        email: user.email,
        role: user.role,
        age: "Not Provided",
        medicalHistory: ["Not Available"],
      });
    }

    // Merge Data
    const mergedData = {
      name: user.username,
      email: user.email,
      role: user.role,
      age: patient.age || "Not Provided",
      medicalHistory: patient.medicalHistory.length > 0 ? patient.medicalHistory : ["Not Available"],
    };

    res.json(mergedData);
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ error: "Server Error" });
  }
});
/*
  DOCTOR ROUTES
 */
// Registering a Doctor
  router.post(
    "/signup/doctor",
    [
      body("email").isEmail().withMessage("Invalid email"),
      body("specialization").notEmpty().withMessage("Specialization is required"),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
      try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.json({ message: "Doctor registered successfully", doctor });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );
 
  router.get("/doctor/:id", async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId).select("username email role");
      if (!user || user.role !== "doctor") {
        return res.status(404).json({ error: "Doctor not found" });
      }
  
      const doctor = await Doctor.findOne({ userId: userId });
  
      const mergedData = {
        name: user.username || "Not Available",
        email: user.email,
        role: user.role,
        specialization: doctor?.specialization || "Not Provided",
        experience: doctor?.experience || "Not Provided",
        contactNumber: doctor?.contactNumber || "Not Available",
        bio: doctor?.bio || "Not Provided", //  Added bio field
      };
  
      res.json(mergedData);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      res.status(500).json({ error: "Server Error" });
    }
  });
  
/* 
APPOINTMENT ROUTES
*/

// booking an appointment
router.post(
  "/appointment",
  [
    body("patientId").notEmpty().withMessage("Patient ID is required"),
    body("doctorId").notEmpty().withMessage("Doctor ID is required"),
    body("date").isISO8601().toDate().withMessage("Invalid date"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const appointment = new Appointment(req.body);
      await appointment.save();
      res.json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);
// Get patient appointment details
router.get("/patientappointments/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ message: "Patient ID is required" });

    const appointments = await Appointment.find({ patientId });
    if (appointments.length === 0) return res.status(404).json({ message: "No appointments found" });

    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//   Get doctor-specific appointments (Doctor)
router.get("/appointments", async (req, res) => {
  try {
    const { doctorId } = req.query;
    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    const appointments = await Appointment.find({ doctorId }).populate("patientId", "username");
    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// updating status of request
router.put("/statusupdate", async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    if (!appointmentId || !status) {
      return res.status(400).json({ error: "Appointment ID and status are required" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Appointment status updated successfully!", appointment });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get all doctor details
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find(); // Get all doctors from Doctor collection

    const doctorDetails = await Promise.all(
      doctors.map(async (doctor) => {
        const user = await User.findById(doctor.userId).select("username");
        return {
          userId: doctor.userId,
          name: user ? user.username : "Unknown",
          specialization: doctor.specialization,
          experience: doctor.experience
        };
      })
    );

    res.json(doctorDetails);
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    res.status(500).json({ error: "Server Error" });
  }
});



// Cancel an appointment (optional)
router.delete("/cancel-appointment/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    await Appointment.findByIdAndDelete(appointmentId);
    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;


