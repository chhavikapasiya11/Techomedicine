const express = require("express");
const router = express.Router();
const Appointment = require("../../models/Appointment");

// PUT /api/start-meeting
router.put("/start-meeting", async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const randomString = Math.random().toString(36).substring(2, 10);
    const meetingLink = `https://meet.jit.si/${randomString}`;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { meetingLink },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ meetingLink });
  } catch (err) {
    console.error("Error starting meeting:", err);
    res.status(500).json({ message: "Failed to start meeting" });
  }
});

module.exports = router;
