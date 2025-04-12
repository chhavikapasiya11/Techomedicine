
const express = require("express");
const router = express.Router();
const Appointment = require("../../models/Appointment");

router.get("/appointment/:appointmentId/meeting-link", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.meetingLink) {
      return res.status(404).json({ message: "Meeting not started yet by doctor" });
    }

    res.json({ meetingLink: appointment.meetingLink });
  } catch (err) {
    console.error("Error fetching meeting link:", err);
    res.status(500).json({ message: "Failed to fetch meeting link" });
  }
});

module.exports = router;
